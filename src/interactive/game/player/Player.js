import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier, useBeforePhysicsStep } from '@react-three/rapier';
import * as THREE from 'three';
import { input, consume, readMove } from '../input/input';
import { runtime, getState } from '../core/store';
import { emit } from '../core/events';
import { SPAWN, KILL_Y, JUMP_PADS, STONES } from '../core/layout';
import Robot from './Robot';

// ---------------------------------------------------------------------
// Tuning. Values are in metres / seconds and were chosen for a snappy,
// readable platformer feel (think Mario Odyssey / Astro Bot, not Skyrim).
// ---------------------------------------------------------------------
export const TUNE = {
  runSpeed: 7.4,
  groundAccel: 62,
  groundDecel: 46,
  airAccel: 26,
  airDecel: 8,
  turnRate: 15, // rad/s-ish smoothing for facing
  gravity: 34,
  fallGravityMult: 1.55,
  lowJumpGravityMult: 2.4, // released jump early → shorter hop
  jumpVel: 11.6,
  doubleJumpVel: 10.4,
  maxFall: 34,
  coyote: 0.12,
  jumpBuffer: 0.14,
  dashSpeed: 19,
  dashTime: 0.17,
  dashCooldown: 0.55,
  halfHeight: 0.42,
  radius: 0.38,
};

const FEET = TUNE.halfHeight + TUNE.radius;
const STEP = 1 / 60;

// Shared, mutable character state — the robot animator and the camera read it.
export function createCharacterState() {
  return {
    pos: new THREE.Vector3(SPAWN.x, SPAWN.y + FEET, SPAWN.z),
    prev: new THREE.Vector3(SPAWN.x, SPAWN.y + FEET, SPAWN.z),
    render: new THREE.Vector3(SPAWN.x, SPAWN.y + FEET, SPAWN.z),
    vel: new THREE.Vector3(),
    yaw: SPAWN.yaw,
    targetYaw: SPAWN.yaw,
    yawVel: 0,
    grounded: true,
    airTime: 0,
    sinceGrounded: 0,
    sinceJumpPressed: 99,
    jumpsLeft: 1,
    dashT: 0,
    dashCd: 0,
    dashDir: new THREE.Vector3(),
    canAirDash: true,
    landImpact: 0, // set on landing, decays in animator
    lastSafe: new THREE.Vector3(SPAWN.x, SPAWN.y + FEET, SPAWN.z),
    safeTimer: 0,
    rising: false,
    moving: 0, // 0..1 normalized horizontal speed
    padCd: 0,
    padFlight: false, // aimed launch in progress: damp air control
    intro: 0, // >0 while the drop-in intro is playing
    frozen: false,
  };
}

const tmpMove = new THREE.Vector3();

export default function Player({ character }) {
  const body = useRef(null);
  const collider = useRef(null);
  const { world, rapier } = useRapier();
  const acc = useRef(0);
  const ch = character;

  // Created in an effect (not a memo) so a StrictMode-style remount never
  // keeps using a controller whose WASM memory was already freed.
  const controllerRef = useRef(null);
  useEffect(() => {
    const c = world.createCharacterController(0.03);
    c.setUp({ x: 0, y: 1, z: 0 });
    c.setMaxSlopeClimbAngle((52 * Math.PI) / 180);
    c.setMinSlopeSlideAngle((62 * Math.PI) / 180);
    c.enableAutostep(0.45, 0.25, false);
    c.enableSnapToGround(0.35);
    c.setSlideEnabled(true);
    c.setApplyImpulsesToDynamicBodies(true);
    c.setCharacterMass(60);
    controllerRef.current = c;
    return () => {
      controllerRef.current = null;
      world.removeCharacterController(c);
    };
  }, [world]);

  useBeforePhysicsStep(() => {
    const rb = body.current;
    const col = collider.current;
    const controller = controllerRef.current;
    if (!rb || !col || !controller) return;
    const dt = STEP;
    const s = getState();

    // teleport requests (fast travel / respawn)
    if (runtime.teleport) {
      const t = runtime.teleport;
      runtime.teleport = null;
      ch.pos.set(t.x, t.y + FEET, t.z);
      ch.prev.copy(ch.pos);
      ch.vel.set(0, 0, 0);
      ch.yaw = ch.targetYaw = t.yaw ?? ch.yaw;
      ch.lastSafe.copy(ch.pos);
      ch.dashT = 0;
      rb.setNextKinematicTranslation(ch.pos);
      rb.setTranslation(ch.pos, true);
      return;
    }

    ch.prev.copy(ch.pos);

    const controllable = s.phase === 'playing' && !s.paused && !s.panel && !s.mapOpen && !ch.frozen;
    const mv = controllable ? readMove() : { x: 0, y: 0 };

    // camera-relative wish direction on the ground plane
    const cy = runtime.camera.yaw;
    const fx = -Math.sin(cy);
    const fz = -Math.cos(cy);
    const rx = Math.cos(cy);
    const rz = -Math.sin(cy);
    const wishX = fx * mv.y + rx * mv.x;
    const wishZ = fz * mv.y + rz * mv.x;
    const wishLen = Math.min(1, Math.hypot(wishX, wishZ));

    // ---- timers
    ch.sinceGrounded = ch.grounded ? 0 : ch.sinceGrounded + dt;
    ch.sinceJumpPressed += dt;
    ch.dashCd = Math.max(0, ch.dashCd - dt);
    ch.padCd = Math.max(0, ch.padCd - dt);

    if (controllable && consume('jump')) ch.sinceJumpPressed = 0;
    const wantsDash = controllable && consume('dash');
    if (!controllable) {
      consume('jump');
      consume('dash');
    }

    // ---- horizontal velocity
    const vx = ch.vel.x;
    const vz = ch.vel.z;
    if (ch.dashT > 0) {
      ch.dashT -= dt;
      ch.vel.x = ch.dashDir.x * TUNE.dashSpeed;
      ch.vel.z = ch.dashDir.z * TUNE.dashSpeed;
      ch.vel.y = Math.max(ch.vel.y, 0) * 0.5; // dashes are flat and floaty
      if (ch.dashT <= 0) {
        // keep some momentum out of the dash
        ch.vel.x *= 0.55;
        ch.vel.z *= 0.55;
      }
    } else {
      const target = TUNE.runSpeed * wishLen;
      const tx = wishLen > 0.001 ? (wishX / Math.hypot(wishX, wishZ)) * target : 0;
      const tz = wishLen > 0.001 ? (wishZ / Math.hypot(wishX, wishZ)) * target : 0;
      const accelerating = wishLen > 0.05;
      let rate = ch.grounded
        ? accelerating ? TUNE.groundAccel : TUNE.groundDecel
        : accelerating ? TUNE.airAccel : TUNE.airDecel;
      if (ch.padFlight && !ch.grounded) rate *= 0.18;
      const dx = tx - vx;
      const dz = tz - vz;
      const dl = Math.hypot(dx, dz);
      const maxStep = rate * dt;
      if (dl <= maxStep) {
        ch.vel.x = tx;
        ch.vel.z = tz;
      } else {
        ch.vel.x += (dx / dl) * maxStep;
        ch.vel.z += (dz / dl) * maxStep;
      }
    }

    if (wantsDash && ch.dashCd <= 0 && (ch.grounded || ch.canAirDash)) {
      const len = Math.hypot(wishX, wishZ);
      if (len > 0.1) ch.dashDir.set(wishX / len, 0, wishZ / len);
      else ch.dashDir.set(Math.sin(ch.yaw), 0, Math.cos(ch.yaw));
      ch.dashT = TUNE.dashTime;
      ch.dashCd = TUNE.dashCooldown;
      if (!ch.grounded) ch.canAirDash = false;
      ch.targetYaw = Math.atan2(ch.dashDir.x, ch.dashDir.z);
      emit('dash', { pos: ch.pos });
    }

    // ---- jumping: buffer + coyote + double jump
    const buffered = ch.sinceJumpPressed <= TUNE.jumpBuffer;
    if (buffered) {
      if (ch.grounded || ch.sinceGrounded <= TUNE.coyote) {
        ch.vel.y = TUNE.jumpVel;
        ch.grounded = false;
        ch.sinceGrounded = TUNE.coyote + 1;
        ch.sinceJumpPressed = 99;
        ch.rising = true;
        emit('jump', { pos: ch.pos });
      } else if (ch.jumpsLeft > 0) {
        ch.vel.y = TUNE.doubleJumpVel;
        ch.jumpsLeft -= 1;
        ch.sinceJumpPressed = 99;
        ch.rising = true;
        ch.dashT = 0;
        emit('doubleJump', { pos: ch.pos });
      }
    }

    // ---- gravity
    if (ch.dashT <= 0) {
      let g = TUNE.gravity;
      if (ch.vel.y < 0) g *= TUNE.fallGravityMult;
      else if (!input.held.jump && ch.rising) g *= TUNE.lowJumpGravityMult;
      ch.vel.y = Math.max(-TUNE.maxFall, ch.vel.y - g * dt);
    }
    if (ch.vel.y <= 0) ch.rising = false;
    if (ch.grounded && ch.vel.y < 0) ch.vel.y = -2; // keep pressed to slopes

    // ---- collide & slide
    tmpMove.set(ch.vel.x * dt, ch.vel.y * dt, ch.vel.z * dt);
    controller.computeColliderMovement(col, tmpMove, rapier.QueryFilterFlags.EXCLUDE_SENSORS);
    const m = controller.computedMovement();
    const wasGrounded = ch.grounded;
    ch.grounded = controller.computedGrounded();

    // hit a ceiling
    if (tmpMove.y > 0 && m.y < tmpMove.y * 0.5) ch.vel.y = Math.min(ch.vel.y, 0);
    // hit a wall: bleed the blocked part of horizontal velocity
    if (Math.abs(tmpMove.x) > 1e-5 && Math.abs(m.x) < Math.abs(tmpMove.x) * 0.5) ch.vel.x = m.x / dt;
    if (Math.abs(tmpMove.z) > 1e-5 && Math.abs(m.z) < Math.abs(tmpMove.z) * 0.5) ch.vel.z = m.z / dt;

    ch.pos.set(ch.pos.x + m.x, ch.pos.y + m.y, ch.pos.z + m.z);
    rb.setNextKinematicTranslation(ch.pos);

    if (ch.grounded) {
      if (!wasGrounded) {
        const impact = Math.min(1, Math.max(0, -ch.vel.y) / 26 + ch.airTime * 0.35);
        ch.landImpact = Math.max(ch.landImpact, impact);
        emit('land', { pos: ch.pos, impact });
      }
      ch.airTime = 0;
      ch.padFlight = false;
      ch.jumpsLeft = 1;
      ch.canAirDash = true;
      ch.safeTimer += dt;
      if (ch.safeTimer > 0.4) {
        ch.lastSafe.copy(ch.pos);
        ch.safeTimer = 0;
      }
    } else {
      ch.airTime += dt;
      ch.safeTimer = 0;
    }

    // ---- jump pads (cheap radial test)
    if (ch.padCd <= 0) {
      for (const p of JUMP_PADS) {
        const dy = ch.pos.y - FEET - p.y;
        if (dy > -0.2 && dy < 0.6 && Math.hypot(ch.pos.x - p.x, ch.pos.z - p.z) < 1.35) {
          ch.vel.y = p.power;
          ch.grounded = false;
          const T = p.target && STONES.find(st => st.id === p.target);
          if (T) {
            // solve the horizontal speed that lands us on the target:
            // rise with normal gravity, fall with the heavier fall gravity
            const up = p.power / TUNE.gravity;
            const apex = p.y + (p.power * p.power) / (2 * TUNE.gravity);
            const down = Math.sqrt((2 * Math.max(0.1, apex - T.y)) / (TUNE.gravity * TUNE.fallGravityMult));
            const dx = T.x - ch.pos.x;
            const dz = T.z - ch.pos.z;
            ch.vel.x = dx / (up + down);
            ch.vel.z = dz / (up + down);
            ch.targetYaw = Math.atan2(dx, dz);
            ch.padFlight = true;
          }
          ch.sinceGrounded = 1;
          ch.jumpsLeft = 1;
          ch.canAirDash = true;
          ch.padCd = 0.5;
          ch.rising = false; // full height regardless of jump being held
          emit('pad', { pos: ch.pos, pad: p });
          break;
        }
      }
    }

    // ---- facing
    const hs = Math.hypot(ch.vel.x, ch.vel.z);
    if (hs > 0.6 && ch.dashT <= 0 && wishLen > 0.05) ch.targetYaw = Math.atan2(wishX, wishZ);
    let dyaw = ch.targetYaw - ch.yaw;
    dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
    const turn = dyaw * Math.min(1, TUNE.turnRate * dt);
    ch.yawVel = turn / dt;
    ch.yaw += turn;
    ch.moving = Math.min(1, hs / TUNE.runSpeed);

    // ---- fell off the world
    if (ch.pos.y < KILL_Y) {
      emit('respawn', {});
      runtime.teleport = { x: ch.lastSafe.x, y: ch.lastSafe.y - FEET + 0.4, z: ch.lastSafe.z };
    }

    // publish for UI / minimap
    const P = runtime.player;
    P.x = ch.pos.x;
    P.y = ch.pos.y - FEET;
    P.z = ch.pos.z;
    P.yaw = ch.yaw;
    P.speed = hs;
    P.grounded = ch.grounded;
    P.vy = ch.vel.y;
  });

  // Render-rate interpolation between the last two fixed steps. Mirrors
  // the physics accumulator (same clamped delta), so alpha is exact.
  useFrame((_, dt) => {
    const st = getState();
    if (st.paused || st.mapOpen) {
      ch.render.copy(ch.pos);
      return;
    }
    acc.current += Math.min(dt, 0.5);
    while (acc.current >= STEP) acc.current -= STEP;
    const alpha = acc.current / STEP;
    ch.render.lerpVectors(ch.prev, ch.pos, alpha);
  }, -40);

  return (
    <>
      <RigidBody
        ref={body}
        type="kinematicPosition"
        colliders={false}
        position={[ch.pos.x, ch.pos.y, ch.pos.z]}
        enabledRotations={[false, false, false]}
        userData={{ player: true }}
      >
        <CapsuleCollider ref={collider} args={[TUNE.halfHeight, TUNE.radius]} />
      </RigidBody>
      <Robot character={ch} feet={FEET} />
    </>
  );
}
