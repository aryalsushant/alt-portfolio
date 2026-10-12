import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import { input, takeLook } from '../input/input';
import { runtime, getState } from '../core/store';
import { on, cameraBlockers } from '../core/events';
import { damp, dampAngle } from '../core/math';

const MIN_PITCH = -0.2;
const MAX_PITCH = 1.2;
const MIN_DIST = 4;
const MAX_DIST = 15;

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = () => motionQuery.matches;

const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function FollowCamera({ character: ch }) {
  const { camera, size } = useThree();
  const { world, rapier } = useRapier();

  const cam = useMemo(
    () => ({
      yaw: ch.yaw + Math.PI,
      pitch: 0.42,
      dist: 8.5,
      wantDist: 8.5,
      actualDist: 8.5,
      target: ch.render.clone(),
      trauma: 0,
      fovKick: 0,
      introT: 0,
      t: 0,
      ray: new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      titlePos: new THREE.Vector3(),
      titleLook: new THREE.Vector3(),
      blendLook: new THREE.Vector3(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rapier]
  );

  useEffect(() => {
    const offs = [
      on('land', ({ impact }) => {
        if (impact > 0.45) cam.trauma = Math.min(1, cam.trauma + impact * 0.45);
      }),
      on('pad', () => {
        cam.trauma = Math.min(1, cam.trauma + 0.3);
      }),
      on('dash', () => {
        cam.fovKick = 1;
      }),
      on('teleported', () => {
        cam.target.copy(ch.render);
        cam.yaw = ch.yaw + Math.PI;
      }),
    ];
    return () => offs.forEach(f => f());
  }, [cam, ch]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const s = getState();
    cam.t += dt;
    const portrait = size.height > size.width;

    // ---- input
    const look = takeLook();
    const canLook = !s.panel && !s.mapOpen && !s.paused;
    if (canLook) {
      cam.yaw -= look.x;
      cam.pitch = THREE.MathUtils.clamp(cam.pitch + look.y, MIN_PITCH, MAX_PITCH);
      cam.wantDist = THREE.MathUtils.clamp(cam.wantDist + look.zoom, MIN_DIST, MAX_DIST);
    }

    // ---- auto recenter behind the robot while running, after manual input settles
    const sinceLook = (performance.now() - input.lastLookAt) / 1000;
    if (s.phase === 'playing' && sinceLook > 1.4 && ch.moving > 0.3 && ch.dashT <= 0) {
      const behind = ch.yaw + Math.PI;
      // only nudge — never whip the camera around when running toward it
      let d = behind - cam.yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      if (Math.abs(d) < 2.2) cam.yaw = dampAngle(cam.yaw, behind, 0.9 * ch.moving, dt);
    }
    runtime.camera.yaw = cam.yaw;

    // ---- target follows the robot; vertical is lazier in the air
    const tx = ch.render.x + ch.vel.x * 0.1;
    const tz = ch.render.z + ch.vel.z * 0.1;
    const ty = ch.render.y + 0.85;
    cam.target.x = damp(cam.target.x, tx, 11, dt);
    cam.target.z = damp(cam.target.z, tz, 11, dt);
    const vLambda = ch.grounded ? 9 : ch.vel.y < -12 ? 10 : 3.2;
    cam.target.y = damp(cam.target.y, ty, vLambda, dt);
    if (Math.abs(cam.target.y - ty) > 6) cam.target.y = ty; // teleports / big falls

    // ---- collision: pull in when geometry blocks the view
    const cp = Math.cos(cam.pitch);
    const dir = {
      x: Math.sin(cam.yaw) * cp,
      y: Math.sin(cam.pitch),
      z: Math.cos(cam.yaw) * cp,
    };
    const want = cam.wantDist * (portrait ? 1.22 : 1);
    cam.ray.origin = { x: cam.target.x, y: cam.target.y, z: cam.target.z };
    cam.ray.dir = dir;
    const hit = world.castRay(
      cam.ray,
      want + 0.4,
      true,
      rapier.QueryFilterFlags.EXCLUDE_SENSORS |
        rapier.QueryFilterFlags.EXCLUDE_KINEMATIC |
        rapier.QueryFilterFlags.EXCLUDE_DYNAMIC,
      undefined,
      undefined,
      undefined,
      col => cameraBlockers.has(col.handle)
    );
    const limit = hit ? Math.max(2.4, hit.timeOfImpact - 0.4) : want;
    cam.actualDist = limit < cam.actualDist ? damp(cam.actualDist, limit, 25, dt) : damp(cam.actualDist, limit, 3, dt);

    cam.pos.set(
      cam.target.x + dir.x * cam.actualDist,
      cam.target.y + dir.y * cam.actualDist,
      cam.target.z + dir.z * cam.actualDist
    );
    cam.look.copy(cam.target);

    // ---- title-screen cinematic orbit and the swoop into gameplay
    const titleYaw = cam.t * 0.07 + 0.4;
    cam.titleLook.set(0, 2.5, -14);
    cam.titlePos.set(Math.sin(titleYaw) * 30, 13 + Math.sin(cam.t * 0.2) * 2, -14 + Math.cos(titleYaw) * 30);
    if (s.phase === 'loading' || s.phase === 'title') {
      cam.introT = 0;
      camera.position.copy(cam.titlePos);
      camera.lookAt(cam.titleLook);
    } else {
      cam.introT = Math.min(1, cam.introT + dt / 2.2);
      const k = easeInOut(cam.introT);
      camera.position.lerpVectors(cam.titlePos, cam.pos, k);
      cam.blendLook.copy(cam.titleLook).lerp(cam.look, k);
      camera.lookAt(cam.blendLook);
    }

    // ---- shake
    if (cam.trauma > 0 && reducedMotion()) cam.trauma = 0;
    if (cam.trauma > 0) {
      const sh = cam.trauma * cam.trauma * 0.25;
      camera.position.x += (Math.random() - 0.5) * sh;
      camera.position.y += (Math.random() - 0.5) * sh;
      cam.trauma = Math.max(0, cam.trauma - dt * 1.8);
    }

    // ---- fov
    cam.fovKick = Math.max(ch.dashT > 0 ? 1 : 0, cam.fovKick - dt * 3);
    const baseFov = portrait ? 66 : 52;
    const fov = baseFov + (reducedMotion() ? 0 : cam.fovKick * 9 + Math.min(1, ch.moving) * 2);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = damp(camera.fov, fov, 8, dt);
      camera.updateProjectionMatrix();
    }
  }, -30);

  return null;
}
