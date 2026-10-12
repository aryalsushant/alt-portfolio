import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { RigidBody, CylinderCollider, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ISLANDS, BRIDGES, STONES } from '../core/layout';
import { mulberry32 } from '../core/math';
import Blocker from './Blocker';

// ---------------------------------------------------------------------
// Floating island mesh: flat grass cap + jagged rocky underside tapering
// to a point, vertex coloured and flat shaded, merged into one geometry.
// ---------------------------------------------------------------------
function rimNoise(seed) {
  const rnd = mulberry32(seed * 97 + 13);
  const terms = Array.from({ length: 5 }, (_, k) => ({ k: k + 2 + Math.floor(rnd() * 3), p: rnd() * 6.28, a: 0.5 / (k + 1) }));
  return th => terms.reduce((s, t) => s + Math.sin(th * t.k + t.p) * t.a, 0);
}

const C_GRASS_EDGE = new THREE.Color('#4f9a52');
const C_DIRT = new THREE.Color('#b0703f');
const C_ROCK = new THREE.Color('#8a5f7d');
const C_ROCK_DEEP = new THREE.Color('#3f2f63');

export function makeIslandGeometry(r, seed, grassHex, depthScale = 1) {
  const rnd = mulberry32(seed);
  const noise = rimNoise(seed);
  const SEG = Math.max(24, Math.round(r * 4));
  const grass = new THREE.Color(grassHex);
  const rimR = th => r + 0.35 + noise(th) * 0.3;

  // --- grass cap (top disc + short skirt)
  const cap = new THREE.CylinderGeometry(1, 1, 0.5, SEG, 1, false);
  {
    const pos = cap.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const th = Math.atan2(z, x);
      const rad = Math.hypot(x, z);
      const R = rimR(th) * (y < 0 ? 0.985 : 1);
      pos.setXYZ(i, x * R, y - 0.25, z * R);
      if (y > 0 && rad < 0.01) c.copy(grass).offsetHSL(0, 0, 0.04);
      else if (y > 0) c.copy(grass).lerp(C_GRASS_EDGE, 0.15 + rnd() * 0.15);
      else c.copy(C_GRASS_EDGE);
      col.set([c.r, c.g, c.b], i * 3);
    }
    cap.setAttribute('color', new THREE.BufferAttribute(col, 3));
  }

  // --- rocky underside
  const depth = (r * 0.95 + 3) * depthScale;
  const rings = 7;
  const under = new THREE.CylinderGeometry(1, 0.06, depth, SEG, rings, true);
  {
    const pos = under.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    const tipX = (rnd() - 0.5) * r * 0.3;
    const tipZ = (rnd() - 0.5) * r * 0.3;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const t = Math.min(1, Math.max(0, 0.5 - y / depth)); // 0 at top, 1 at tip
      const th = Math.atan2(z, x);
      const jag = 1 + (Math.sin(th * 7 + t * 9 + seed) * 0.08 + Math.sin(th * 13 - t * 5) * 0.05) * (0.4 + t);
      const taper = Math.pow(1 - t, 0.75);
      const R = rimR(th) * 0.97 * jag;
      const k = Math.hypot(x, z) > 1e-4 ? 1 : 0;
      const nx = k ? x / Math.hypot(x, z) : 0;
      const nz = k ? z / Math.hypot(x, z) : 0;
      pos.setXYZ(
        i,
        nx * R * taper * (Math.hypot(x, z) > 1e-4 ? 1 : 0) + tipX * t * t,
        -0.5 - t * depth,
        nz * R * taper * (Math.hypot(x, z) > 1e-4 ? 1 : 0) + tipZ * t * t
      );
      if (t < 0.08) c.copy(C_DIRT);
      else c.copy(C_DIRT).lerp(C_ROCK, Math.min(1, (t - 0.08) * 3)).lerp(C_ROCK_DEEP, Math.max(0, t - 0.4) * 1.6);
      c.offsetHSL(0, 0, (rnd() - 0.5) * 0.04);
      col.set([c.r, c.g, c.b], i * 3);
    }
    under.setAttribute('color', new THREE.BufferAttribute(col, 3));
  }

  const g = mergeGeometries([cap.toNonIndexed(), under.toNonIndexed()]);
  g.computeVertexNormals();
  cap.dispose();
  under.dispose();
  return g;
}

const islandMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  flatShading: true,
  roughness: 0.92,
  metalness: 0,
});

function Island({ island }) {
  const geo = useMemo(() => makeIslandGeometry(island.r, island.seed, island.grass), [island]);
  return (
    <group position={[island.x, island.y, island.z]}>
      <mesh geometry={geo} material={islandMaterial} receiveShadow castShadow />
      <RigidBody type="fixed" colliders={false} position={[0, -1, 0]}>
        <Blocker shape={CylinderCollider} args={[1, island.r + 0.2]} friction={0.8} />
      </RigidBody>
    </group>
  );
}

function Stone({ stone }) {
  const geo = useMemo(() => makeIslandGeometry(stone.r, 40 + stone.y * 10, '#c8e37a', 0.55), [stone]);
  return (
    <group position={[stone.x, stone.y, stone.z]}>
      <mesh geometry={geo} material={islandMaterial} receiveShadow castShadow />
      <RigidBody type="fixed" colliders={false} position={[0, -0.6, 0]}>
        <Blocker shape={CylinderCollider} args={[0.6, stone.r + 0.15]} />
      </RigidBody>
    </group>
  );
}

// ---------------------------------------------------------------------
// Bridges: instanced planks + posts + rope rails for every bridge in one
// draw call each; per-bridge fixed colliders (deck + side rails).
// ---------------------------------------------------------------------
const BRIDGE_W = 2.4;

function bridgeFrame(b) {
  const dx = b.to.x - b.from.x;
  const dy = b.to.y - b.from.y;
  const dz = b.to.z - b.from.z;
  const h = Math.hypot(dx, dz);
  const len = Math.hypot(h, dy);
  const yaw = Math.atan2(dx, dz);
  const pitch = -Math.atan2(dy, h);
  const mid = new THREE.Vector3((b.from.x + b.to.x) / 2, (b.from.y + b.to.y) / 2, (b.from.z + b.to.z) / 2);
  const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
  return { len, yaw, pitch, mid, quat };
}

function Bridges() {
  const planks = useRef();
  const posts = useRef();
  const ropes = useRef();

  const data = useMemo(() => {
    const rnd = mulberry32(777);
    const plankM = [];
    const plankC = [];
    const postM = [];
    const ropeM = [];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const base = new THREE.Color('#a8714a');
    BRIDGES.forEach(b => {
      const f = bridgeFrame(b);
      const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(f.quat);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(f.quat);
      const n = Math.floor(f.len / 0.56);
      for (let i = 0; i <= n; i++) {
        const t = i / n - 0.5;
        const p = f.mid.clone().addScaledVector(fwd, t * f.len);
        p.y += (rnd() - 0.5) * 0.03;
        e.set(f.pitch + (rnd() - 0.5) * 0.05, f.yaw + (rnd() - 0.5) * 0.06, (rnd() - 0.5) * 0.04, 'YXZ');
        q.setFromEuler(e);
        m.compose(p, q, new THREE.Vector3(BRIDGE_W + (rnd() - 0.5) * 0.25, 1, 1));
        plankM.push(m.clone());
        plankC.push(base.clone().offsetHSL((rnd() - 0.5) * 0.03, 0, (rnd() - 0.5) * 0.1));
      }
      const postsN = Math.max(2, Math.round(f.len / 2.6));
      for (let i = 0; i <= postsN; i++) {
        const t = i / postsN - 0.5;
        [-1, 1].forEach(side => {
          const p = f.mid.clone().addScaledVector(fwd, t * f.len).addScaledVector(right, side * (BRIDGE_W / 2 - 0.05));
          p.y += 0.5;
          m.compose(p, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
          postM.push(m.clone());
        });
      }
      // rope rails: one stretched cylinder per side, slightly sagging via two halves
      [-1, 1].forEach(side => {
        for (let half = 0; half < 2; half++) {
          const a = half === 0 ? -0.5 : 0;
          const c = half === 0 ? 0 : 0.5;
          const pa = f.mid.clone().addScaledVector(fwd, a * f.len).addScaledVector(right, side * (BRIDGE_W / 2 - 0.05));
          const pc = f.mid.clone().addScaledVector(fwd, c * f.len).addScaledVector(right, side * (BRIDGE_W / 2 - 0.05));
          pa.y += half === 0 ? 0.95 : 0.78;
          pc.y += half === 0 ? 0.78 : 0.95;
          const dir = pc.clone().sub(pa);
          const L = dir.length();
          const mid = pa.clone().add(pc).multiplyScalar(0.5);
          const qq = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
          m.compose(mid, qq, new THREE.Vector3(1, L, 1));
          ropeM.push(m.clone());
        }
      });
    });
    return { plankM, plankC, postM, ropeM };
  }, []);

  useLayoutEffect(() => {
    data.plankM.forEach((m, i) => {
      planks.current.setMatrixAt(i, m);
      planks.current.setColorAt(i, data.plankC[i]);
    });
    planks.current.instanceMatrix.needsUpdate = true;
    planks.current.instanceColor.needsUpdate = true;
    data.postM.forEach((m, i) => posts.current.setMatrixAt(i, m));
    posts.current.instanceMatrix.needsUpdate = true;
    data.ropeM.forEach((m, i) => ropes.current.setMatrixAt(i, m));
    ropes.current.instanceMatrix.needsUpdate = true;
    [planks, posts, ropes].forEach(r => r.current.computeBoundingSphere());
  }, [data]);

  return (
    <>
      <instancedMesh ref={planks} args={[null, null, data.plankM.length]} castShadow receiveShadow frustumCulled={false}>
        <boxGeometry args={[1, 0.14, 0.48]} />
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={posts} args={[null, null, data.postM.length]} castShadow frustumCulled={false}>
        <cylinderGeometry args={[0.07, 0.09, 1.15, 7]} />
        <meshStandardMaterial color="#7a4e32" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={ropes} args={[null, null, data.ropeM.length]} frustumCulled={false}>
        <cylinderGeometry args={[0.03, 0.03, 1, 6]} />
        <meshStandardMaterial color="#e8d3a8" roughness={1} />
      </instancedMesh>

      {BRIDGES.map(b => {
        const f = bridgeFrame(b);
        return (
          <RigidBody key={b.id} type="fixed" colliders={false} position={f.mid.toArray()} quaternion={f.quat.toArray()}>
            <Blocker shape={CuboidCollider} args={[BRIDGE_W / 2, 0.15, f.len / 2 + 0.3]} position={[0, -0.08, 0]} />
            <CuboidCollider args={[0.08, 0.7, f.len / 2 - 1.2]} position={[-BRIDGE_W / 2 + 0.05, 0.7, 0]} />
            <CuboidCollider args={[0.08, 0.7, f.len / 2 - 1.2]} position={[BRIDGE_W / 2 - 0.05, 0.7, 0]} />
          </RigidBody>
        );
      })}
    </>
  );
}

export default function Terrain() {
  return (
    <>
      {ISLANDS.map(i => (
        <Island key={i.id} island={i} />
      ))}
      {STONES.map(s => (
        <Stone key={s.id} stone={s} />
      ))}
      <Bridges />
    </>
  );
}
