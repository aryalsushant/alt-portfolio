import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { JUMP_PADS, SHARDS, ZONES, INTERACTABLES } from '../core/layout';
import { runtime, getState, setState, addUnique, toast } from '../core/store';
import { emit, on } from '../core/events';
import { ACHIEVEMENTS } from '../core/achievements';

// ---------------------------------------------------------------------
// Jump pads: emissive disc + rising rings
// ---------------------------------------------------------------------
function JumpPad({ p }) {
  const rings = useRef();
  const disc = useRef();
  const kick = useRef(0);
  useEffect(
    () =>
      on('pad', ({ pad }) => {
        if (pad.id === p.id) kick.current = 1;
      }),
    [p.id]
  );
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    kick.current = Math.max(0, kick.current - dt * 2.5);
    rings.current.children.forEach((r, i) => {
      const k = (t * 0.7 + i / 3) % 1;
      r.position.y = 0.1 + k * 2.4;
      r.scale.setScalar(1 - k * 0.45 + kick.current * 0.4);
      r.material.opacity = (1 - k) * 0.8;
    });
    disc.current.scale.setScalar(1 + kick.current * 0.25);
    disc.current.position.y = 0.12 - kick.current * 0.1;
  });
  const color = useMemo(() => new THREE.Color(p.color).multiplyScalar(2.4), [p.color]);
  return (
    <group position={[p.x, p.y, p.z]}>
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.45, 1.6, 0.12, 28]} />
        <meshStandardMaterial color="#2a2547" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh ref={disc} position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 1.2, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 24]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.7} />
      </mesh>
      <group ref={rings}>
        {[0, 1, 2].map(i => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.0, 1.12, 32]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function JumpPads() {
  return JUMP_PADS.map(p => <JumpPad key={p.id} p={p} />);
}

// ---------------------------------------------------------------------
// Data shards: one instanced mesh; collection is a distance check
// ---------------------------------------------------------------------
export function Shards() {
  const ref = useRef();
  const halo = useRef();
  const collected = useRef(new Set(getState().shards));
  const pop = useRef(new Map()); // id -> t (0..1) collection pop animation
  const combo = useRef({ n: 0, t: 0 });
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const e = useMemo(() => new THREE.Euler(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const s = useMemo(() => new THREE.Vector3(), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#7ff3ff',
        emissive: new THREE.Color('#5ff0ff'),
        emissiveIntensity: 2.2,
        metalness: 0.3,
        roughness: 0.1,
        flatShading: true,
        toneMapped: false,
      }),
    []
  );

  useEffect(
    () =>
      on('progressReset', () => {
        collected.current = new Set();
      }),
    []
  );

  useLayoutEffect(() => {
    ref.current.computeBoundingSphere();
  }, []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const P = runtime.player;
    combo.current.t -= dt;
    if (combo.current.t <= 0) combo.current.n = 0;
    SHARDS.forEach((sh, i) => {
      let scale = 1;
      if (collected.current.has(sh.id)) {
        const p = pop.current.get(sh.id);
        if (p === undefined) scale = 0;
        else {
          const k = Math.min(1, p + dt * 3.5);
          pop.current.set(sh.id, k);
          if (k >= 1) pop.current.delete(sh.id);
          scale = (1 - k) * 1.8;
          v.set(sh.x, sh.y + k * 1.6, sh.z);
        }
      } else {
        const dx = P.x - sh.x;
        const dz = P.z - sh.z;
        const dy = P.y + 0.8 - sh.y;
        if (dx * dx + dz * dz < 1.25 && Math.abs(dy) < 1.3) {
          collected.current.add(sh.id);
          pop.current.set(sh.id, 0);
          combo.current.n += 1;
          combo.current.t = 2.2;
          addUnique('shards', sh.id);
          emit('collect', { pos: { x: sh.x, y: sh.y, z: sh.z }, combo: combo.current.n, count: getState().shards.length });
        }
        v.set(sh.x, sh.y + Math.sin(t * 2 + i) * 0.18, sh.z);
      }
      e.set(0.3, t * 1.8 + i, 0.2);
      q.setFromEuler(e);
      s.set(0.32 * scale, 0.5 * scale, 0.32 * scale);
      m.compose(v, q, s);
      ref.current.setMatrixAt(i, m);
      s.setScalar(scale * (1.1 + Math.sin(t * 3 + i) * 0.1));
      m.compose(v, q.identity(), s);
      halo.current.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    halo.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={ref} args={[null, mat, SHARDS.length]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
      </instancedMesh>
      <instancedMesh ref={halo} args={[null, null, SHARDS.length]} frustumCulled={false}>
        <sphereGeometry args={[0.55, 12, 8]} />
        <meshBasicMaterial color="#5ff0ff" transparent opacity={0.12} depthWrite={false} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

// ---------------------------------------------------------------------
// Zone discovery, interaction prompt and achievement bookkeeping.
// Runs every frame but only touches React state when something changes.
// ---------------------------------------------------------------------
export function award(id) {
  const a = ACHIEVEMENTS.find(x => x.id === id);
  if (a && addUnique('achievements', id)) {
    toast({ kind: 'achievement', title: a.title, body: a.body });
    emit('achievement', { id });
  }
}

export function ZoneTracker() {
  const last = useRef({ zone: null, prompt: null });
  const moved = useRef(0);

  useEffect(() => {
    const offs = [
      on('doubleJump', () => award('airborne')),
      on('dash', () => award('dash')),
      on('collect', ({ count }) => {
        if (count === 1) award('firstShard');
        if (count >= SHARDS.length) award('collector');
        else if (count % 5 === 0) toast({ kind: 'info', title: `${count} / ${SHARDS.length} data shards`, body: 'Keep exploring — some float out of reach.', duration: 2600 });
      }),
      on('pad', () => award('launch')),
      on('panelOpened', ({ key }) => {
        addUnique('panelsOpened', key);
        if (getState().panelsOpened.length >= 6) award('bookworm');
      }),
    ];
    return () => offs.forEach(f => f());
  }, []);

  useFrame((_, dt) => {
    const s = getState();
    if (s.phase !== 'playing') return;
    const P = runtime.player;
    if (P.speed > 1) {
      moved.current += dt;
      if (moved.current > 1.5) award('firstSteps');
    }

    // zone: horizontal distance within the island rim and roughly on top
    let zone = null;
    for (const z of ZONES) {
      if (Math.hypot(P.x - z.x, P.z - z.z) < z.r + 0.6 && P.y > z.y - 3 && P.y < z.y + 8) {
        zone = z.id;
        break;
      }
    }
    if (zone !== last.current.zone) {
      last.current.zone = zone;
      setState({ zone });
      if (zone && !s.discovered.includes(zone)) {
        addUnique('discovered', zone);
        const Z = ZONES.find(z => z.id === zone);
        if (zone !== 'spawn') {
          toast({ kind: 'zone', title: Z.name, body: 'New area discovered', color: Z.color, icon: Z.icon });
          emit('discover', { zone });
        }
        if (zone === 'awards') award('summit');
        if (getState().discovered.length >= ZONES.length) award('explorer');
      }
    }

    // nearest interactable in range
    let best = null;
    let bestD = Infinity;
    for (const it of INTERACTABLES) {
      const d = Math.hypot(P.x - it.x, P.z - it.z);
      if (d < it.r && Math.abs(P.y - it.y) < 2.5 && d < bestD) {
        best = it;
        bestD = d;
      }
    }
    const id = best ? best.id : null;
    if (id !== last.current.prompt) {
      last.current.prompt = id;
      setState({ prompt: best ? { id: best.id, label: best.label, verb: best.verb, panel: best.panel } : null });
    }
  });
  return null;
}
