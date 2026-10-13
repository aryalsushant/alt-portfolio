import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import { on, emit } from '../core/events';
import { INTERACTABLES } from '../core/layout';
import { damp, dampAngle, Spring } from '../core/math';

// Procedurally animated robot. No skeletal clips — every motion is driven
// by the character state so it responds instantly to input:
// stride synced to ground speed, lean into acceleration, bank into turns,
// squash & stretch on jump/land, springy antenna, blinking, head tracking.

const C = {
  head: '#eef1f8',
  visor: '#141a30',
  eye: '#6ff7ee',
  body: '#ff8a52',
  bodyDark: '#e5643c',
  limb: '#aab4cc',
  foot: '#3f4766',
  gold: '#ffd166',
  pink: '#ff7ac8',
};

const down = { x: 0, y: -1, z: 0 };

export default function Robot({ character: ch, feet }) {
  const root = useRef();
  const lean = useRef();
  const squash = useRef();
  const torso = useRef();
  const head = useRef();
  const eyes = useRef();
  const legL = useRef();
  const legR = useRef();
  const armL = useRef();
  const armR = useRef();
  const antenna = useRef();
  const thrustL = useRef();
  const thrustR = useRef();
  const thrustBack = useRef();
  const shadow = useRef();
  const { world, rapier } = useRapier();

  const anim = useMemo(
    () => ({
      phase: 0,
      leanX: 0,
      bankZ: 0,
      squash: new Spring(340, 17),
      antX: new Spring(120, 7),
      antZ: new Spring(120, 7),
      blinkIn: 2,
      blink: 0,
      happy: 0,
      thrust: 0,
      headYaw: 0,
      headPitch: 0,
      idle: 0,
      wave: 0,
      armFlail: 0,
      groundY: 0,
      t: 0,
    }),
    []
  );

  const eyeMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color(C.eye).multiplyScalar(2.6), toneMapped: false }),
    []
  );
  const thrustMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#7ff3ff').multiplyScalar(3),
        toneMapped: false,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    []
  );
  const chestMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: C.gold, emissive: C.gold, emissiveIntensity: 1.4 }),
    []
  );

  useEffect(() => {
    const offs = [
      on('jump', () => {
        anim.squash.v += 9;
      }),
      on('doubleJump', () => {
        anim.squash.v += 7;
        anim.thrust = 1;
        anim.armFlail = 1;
      }),
      on('pad', () => {
        anim.squash.v += 12;
        anim.thrust = 1.2;
      }),
      on('dash', () => {
        anim.thrust = 1;
      }),
      on('land', ({ impact }) => {
        anim.squash.v -= 6 + impact * 16;
        anim.antX.v += 8 + impact * 20;
      }),
      on('collect', () => {
        anim.happy = 1;
      }),
    ];
    return () => offs.forEach(f => f());
  }, [anim]);

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const ray = useMemo(() => new rapier.Ray({ x: 0, y: 0, z: 0 }, down), [rapier]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const a = anim;
    a.t += dt;
    const r = root.current;
    if (!r) return;

    // ---- placement
    r.position.set(ch.render.x, ch.render.y - feet, ch.render.z);
    r.rotation.y = ch.yaw;

    const speed = ch.moving;
    const grounded = ch.grounded;
    const dashing = ch.dashT > 0;

    // acceleration in local space for lean / antenna
    tmp.copy(ch.accel);
    const sinY = Math.sin(ch.yaw);
    const cosY = Math.cos(ch.yaw);
    const accFwd = tmp.x * sinY + tmp.z * cosY;
    const accSide = tmp.x * cosY - tmp.z * sinY;

    // ---- stride (+ footstep events on each foot plant)
    if (grounded) {
      const before = Math.floor(a.phase / Math.PI);
      a.phase += dt * (3.2 + speed * 8.2);
      const after = Math.floor(a.phase / Math.PI);
      if (after !== before && speed > 0.35) emit('step', { alt: after % 2 === 0 });
    }
    const sw = Math.sin(a.phase);
    const strideAmp = grounded ? speed * 0.95 : 0;

    // ---- lean & bank
    const leanTarget = dashing ? 0.55 : speed * 0.2 + THREE.MathUtils.clamp(accFwd * 0.006, -0.12, 0.12);
    a.leanX = damp(a.leanX, leanTarget, dashing ? 20 : 9, dt);
    const bankTarget = THREE.MathUtils.clamp(-ch.yawVel * 0.045 * speed, -0.32, 0.32);
    a.bankZ = damp(a.bankZ, bankTarget, 8, dt);
    lean.current.rotation.set(a.leanX, 0, a.bankZ);

    // ---- squash & stretch
    if (!grounded) {
      // stretch with vertical speed while airborne
      a.squash.target = THREE.MathUtils.clamp(ch.vel.y * 0.012, -0.08, 0.14);
    } else {
      a.squash.target = 0;
    }
    a.squash.step(dt);
    const s = THREE.MathUtils.clamp(a.squash.x, -0.35, 0.35);
    squash.current.scale.set(1 - s * 0.5, 1 + s, 1 - s * 0.5);

    // ---- body bob & breathing
    const bob = grounded ? Math.abs(Math.cos(a.phase)) * 0.06 * speed : 0;
    const idle = grounded && speed < 0.05;
    a.idle = idle ? a.idle + dt : 0;
    const breathe = idle ? Math.sin(a.t * 2.2) * 0.012 : 0;
    torso.current.position.y = bob + breathe;
    torso.current.rotation.y = sw * 0.12 * speed;

    // ---- legs
    let lL = sw * strideAmp;
    let lR = -sw * strideAmp;
    if (!grounded) {
      if (ch.vel.y > 0) {
        lL = -0.7;
        lR = 0.35;
      } else {
        lL = 0.25;
        lR = -0.15;
      }
    }
    if (dashing) {
      lL = 0.6;
      lR = 0.8;
    }
    legL.current.rotation.x = damp(legL.current.rotation.x, lL, grounded ? 30 : 12, dt);
    legR.current.rotation.x = damp(legR.current.rotation.x, lR, grounded ? 30 : 12, dt);

    // ---- arms
    a.armFlail = Math.max(0, a.armFlail - dt * 1.8);
    let aL = -sw * strideAmp * 0.9;
    let aR = sw * strideAmp * 0.9;
    let spread = 0.12 + speed * 0.05;
    if (!grounded) {
      aL = ch.vel.y > 0 ? -0.6 : -1.9;
      aR = ch.vel.y > 0 ? 0.4 : -1.9;
      spread = ch.vel.y > 0 ? 0.35 : 0.7;
      if (a.armFlail > 0) {
        aL = -2.6 + Math.sin(a.t * 40) * 0.3;
        aR = -2.6 - Math.sin(a.t * 40) * 0.3;
        spread = 0.5;
      }
    }
    if (dashing) {
      aL = 1.2;
      aR = 1.2;
      spread = 0.25;
    }
    // idle wave every so often
    if (idle && a.idle > 5) {
      a.wave = Math.min(1, a.wave + dt * 3);
      if (a.idle > 7.5) a.idle = -3; // rest before waving again
    } else {
      a.wave = Math.max(0, a.wave - dt * 4);
    }
    if (a.wave > 0) {
      aR = THREE.MathUtils.lerp(aR, -2.7, a.wave);
      spread = THREE.MathUtils.lerp(spread, 0.25 + Math.sin(a.t * 12) * 0.25, a.wave);
    }
    armL.current.rotation.x = damp(armL.current.rotation.x, aL, 16, dt);
    armR.current.rotation.x = damp(armR.current.rotation.x, aR, 16, dt);
    armL.current.rotation.z = damp(armL.current.rotation.z, -spread, 12, dt);
    armR.current.rotation.z = damp(armR.current.rotation.z, a.wave > 0 ? spread + 0.3 : spread, 12, dt);

    // ---- head tracks the nearest point of interest
    let lookYaw = 0;
    let lookPitch = 0;
    let best = 7 * 7;
    for (const it of INTERACTABLES) {
      const dx = it.x - ch.render.x;
      const dz = it.z - ch.render.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < best) {
        best = d2;
        let yy = Math.atan2(dx, dz) - ch.yaw;
        yy = Math.atan2(Math.sin(yy), Math.cos(yy));
        lookYaw = THREE.MathUtils.clamp(yy, -0.9, 0.9);
        lookPitch = -0.08;
      }
    }
    if (idle && best >= 49) lookYaw = Math.sin(a.t * 0.6) * 0.5; // glance around
    a.headYaw = dampAngle(a.headYaw, lookYaw, 6, dt);
    a.headPitch = damp(a.headPitch, lookPitch - a.leanX * 0.5, 6, dt);
    head.current.rotation.set(a.headPitch, a.headYaw, 0);

    // ---- antenna spring reacts to acceleration
    a.antX.target = THREE.MathUtils.clamp(-accFwd * 0.01 + a.leanX * -0.8, -0.8, 0.8);
    a.antZ.target = THREE.MathUtils.clamp(accSide * 0.01 - a.bankZ, -0.8, 0.8);
    a.antX.step(dt);
    a.antZ.step(dt);
    antenna.current.rotation.set(a.antX.x, 0, a.antZ.x);

    // ---- eyes: blink + happy squint
    a.blinkIn -= dt;
    if (a.blinkIn <= 0) {
      a.blink = 1;
      a.blinkIn = 2.2 + Math.random() * 3.5;
    }
    a.blink = Math.max(0, a.blink - dt * 9);
    a.happy = Math.max(0, a.happy - dt * 1.2);
    const blinkScale = 1 - Math.sin(a.blink * Math.PI) * 0.92;
    eyes.current.scale.y = blinkScale * (1 - a.happy * 0.55);
    eyes.current.position.y = a.happy * 0.015;

    // ---- thrusters
    a.thrust = Math.max(dashing ? 1 : 0, a.thrust - dt * 2.2);
    const flick = 0.85 + Math.sin(a.t * 60) * 0.15;
    const tl = a.thrust * flick;
    thrustL.current.scale.set(1, tl + 0.0001, 1);
    thrustR.current.scale.set(1, tl + 0.0001, 1);
    thrustL.current.visible = thrustR.current.visible = tl > 0.02 && !dashing;
    thrustBack.current.visible = dashing;
    thrustBack.current.scale.set(1, 0.8 + Math.sin(a.t * 70) * 0.2, 1);

    // ---- blob shadow: ray straight down to whatever is beneath us
    ray.origin = { x: ch.render.x, y: ch.render.y, z: ch.render.z };
    const hit = world.castRay(
      ray,
      40,
      true,
      rapier.QueryFilterFlags.EXCLUDE_SENSORS | rapier.QueryFilterFlags.EXCLUDE_KINEMATIC
    );
    const sh = shadow.current;
    if (hit) {
      const gy = ch.render.y - hit.timeOfImpact;
      const h = ch.render.y - feet - gy;
      sh.visible = true;
      sh.position.set(ch.render.x, gy + 0.03, ch.render.z);
      const k = THREE.MathUtils.clamp(1 - h / 10, 0.25, 1);
      sh.scale.setScalar(0.9 * (0.6 + k * 0.4));
      sh.material.opacity = 0.26 * k;
    } else {
      sh.visible = false;
    }
  }, -35);

  const limbMat = <meshStandardMaterial color={C.limb} roughness={0.45} metalness={0.35} />;

  return (
    <>
      <group ref={root}>
        <group ref={lean}>
          <group ref={squash}>
            <group ref={torso}>
              {/* legs (pivot at hips) */}
              {[
                [legL, -0.15],
                [legR, 0.15],
              ].map(([ref, x], i) => (
                <group key={i} ref={ref} position={[x, 0.5, 0]}>
                  <mesh position={[0, -0.2, 0]} castShadow>
                    <capsuleGeometry args={[0.085, 0.24, 4, 10]} />
                    {limbMat}
                  </mesh>
                  <mesh position={[0, -0.43, 0.05]} castShadow>
                    <boxGeometry args={[0.2, 0.12, 0.3]} />
                    <meshStandardMaterial color={C.foot} roughness={0.6} />
                  </mesh>
                  {/* foot thruster flame */}
                  <mesh ref={i === 0 ? thrustL : thrustR} position={[0, -0.5, 0.05]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.08, 0.5, 10, 1, true]} />
                    <primitive object={thrustMat} attach="material" />
                  </mesh>
                </group>
              ))}

              {/* body */}
              <RoundedBox args={[0.6, 0.5, 0.44]} radius={0.12} smoothness={4} position={[0, 0.74, 0]} castShadow>
                <meshStandardMaterial color={C.body} roughness={0.38} metalness={0.15} />
              </RoundedBox>
              <RoundedBox args={[0.62, 0.1, 0.46]} radius={0.04} smoothness={2} position={[0, 0.56, 0]} castShadow>
                <meshStandardMaterial color={C.bodyDark} roughness={0.5} />
              </RoundedBox>
              {/* chest core */}
              <mesh position={[0, 0.78, 0.225]}>
                <cylinderGeometry args={[0.07, 0.07, 0.03, 20]} />
                <primitive object={chestMat} attach="material" />
              </mesh>
              {/* back thruster pack */}
              <RoundedBox args={[0.34, 0.32, 0.12]} radius={0.04} position={[0, 0.78, -0.27]} castShadow>
                <meshStandardMaterial color={C.limb} roughness={0.4} metalness={0.5} />
              </RoundedBox>
              <mesh ref={thrustBack} position={[0, 0.74, -0.5]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
                <coneGeometry args={[0.11, 0.6, 12, 1, true]} />
                <primitive object={thrustMat} attach="material" />
              </mesh>

              {/* arms (pivot at shoulders) */}
              {[
                [armL, -0.38],
                [armR, 0.38],
              ].map(([ref, x], i) => (
                <group key={i} ref={ref} position={[x, 0.9, 0]}>
                  <mesh position={[0, -0.2, 0]} castShadow>
                    <capsuleGeometry args={[0.075, 0.26, 4, 10]} />
                    {limbMat}
                  </mesh>
                  <mesh position={[0, -0.4, 0]} castShadow>
                    <sphereGeometry args={[0.09, 14, 10]} />
                    <meshStandardMaterial color={C.foot} roughness={0.5} />
                  </mesh>
                </group>
              ))}

              {/* head (pivot at neck) */}
              <group ref={head} position={[0, 1.0, 0]}>
                <RoundedBox args={[0.74, 0.5, 0.56]} radius={0.17} smoothness={5} position={[0, 0.25, 0]} castShadow>
                  <meshStandardMaterial color={C.head} roughness={0.25} metalness={0.1} />
                </RoundedBox>
                {/* visor */}
                <RoundedBox args={[0.58, 0.32, 0.06]} radius={0.1} smoothness={4} position={[0, 0.25, 0.26]}>
                  <meshStandardMaterial color={C.visor} roughness={0.15} metalness={0.6} />
                </RoundedBox>
                <group ref={eyes} position={[0, 0, 0]}>
                  {[-0.12, 0.12].map(x => (
                    <mesh key={x} position={[x, 0.26, 0.295]}>
                      <capsuleGeometry args={[0.045, 0.06, 4, 10]} />
                      <primitive object={eyeMat} attach="material" />
                    </mesh>
                  ))}
                </group>
                {/* cheeks */}
                {[-0.25, 0.25].map(x => (
                  <mesh key={x} position={[x, 0.13, 0.27]}>
                    <circleGeometry args={[0.035, 14]} />
                    <meshBasicMaterial color={C.pink} transparent opacity={0.75} />
                  </mesh>
                ))}
                {/* ear bolts */}
                {[-0.38, 0.38].map(x => (
                  <mesh key={x} position={[x, 0.25, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
                    <meshStandardMaterial color={C.limb} roughness={0.4} metalness={0.5} />
                  </mesh>
                ))}
                {/* antenna on a spring */}
                <group ref={antenna} position={[0, 0.49, 0]}>
                  <mesh position={[0, 0.12, 0]}>
                    <cylinderGeometry args={[0.014, 0.018, 0.24, 8]} />
                    <meshStandardMaterial color="#8f99b4" />
                  </mesh>
                  <mesh position={[0, 0.26, 0]}>
                    <sphereGeometry args={[0.055, 16, 12]} />
                    <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={2.2} toneMapped={false} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <circleGeometry args={[0.55, 28]} />
        <meshBasicMaterial color="#1a1030" transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </>
  );
}
