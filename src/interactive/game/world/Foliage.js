import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CylinderCollider, BallCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ISLANDS, BRIDGES, INTERACTABLES, JUMP_PADS, SHARDS, NAME_ROW } from '../core/layout';
import { mulberry32 } from '../core/math';

// ---------------------------------------------------------------------
// Placement: rejection sampling per island, keeping clear of paths
// (centre → bridge mouth), props, pads and collectibles.
// ---------------------------------------------------------------------
const distToSeg = (px, pz, ax, az, bx, bz) => {
  const vx = bx - ax;
  const vz = bz - az;
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz || 1)));
  return Math.hypot(px - (ax + vx * t), pz - (az + vz * t));
};

const CLEAR_CENTER = { spawn: 4.5, research: 4.2, contact: 3.2, awards: 99, about: 3, skills: 3.2, experience: 5, projects: 6.5, education: 4 };

function blocked(island, x, z, pad) {
  if (Math.hypot(x - island.x, z - island.z) < (CLEAR_CENTER[island.id] || 3) + pad) return true;
  for (const b of BRIDGES) {
    for (const end of [b.from, b.to]) {
      if (Math.hypot(end.x - island.x, end.z - island.z) > island.r + 2) continue;
      if (distToSeg(x, z, island.x, island.z, end.x, end.z) < 2 + pad) return true;
    }
  }
  for (const it of INTERACTABLES) if (Math.hypot(x - it.x, z - it.z) < it.r + 0.8 + pad) return true;
  for (const p of JUMP_PADS) if (Math.hypot(x - p.x, z - p.z) < 2.5 + pad) return true;
  for (const s of SHARDS) if (Math.hypot(x - s.x, z - s.z) < 1 + pad) return true;
  if (island.id === 'spawn' && Math.abs(z - NAME_ROW.z) < 1.6 + pad && Math.abs(x) < 11) return true;
  if (island.id === 'spawn' && z > 1 && Math.abs(x) < 7) return true; // opening camera shot
  if (island.id === 'projects') {
    // keep the walkway from the pad to the summit stones clear
    if (distToSeg(x, z, island.x, island.z, 46, -70) < 2.2 + pad) return true;
  }
  return false;
}

function scatter({ count, minR, maxR, pad, seed, perIsland }) {
  const out = [];
  ISLANDS.forEach(I => {
    const rnd = mulberry32(seed + I.seed * 31);
    const n = Math.round((perIsland ? perIsland(I) : count) || 0);
    let tries = 0;
    let placed = 0;
    while (placed < n && tries < n * 30) {
      tries++;
      const a = rnd() * Math.PI * 2;
      const rr = I.r * Math.sqrt(minR + (maxR - minR) * rnd());
      const x = I.x + Math.cos(a) * rr;
      const z = I.z + Math.sin(a) * rr;
      if (blocked(I, x, z, pad)) continue;
      if (out.some(o => o.island === I.id && Math.hypot(o.x - x, o.z - z) < pad * 2.2)) continue;
      out.push({ x, y: I.y, z, island: I.id, rnd: rnd(), rot: rnd() * Math.PI * 2 });
      placed++;
    }
  });
  return out;
}

// Wind sway injected into standard materials (keeps lighting, fog, shadows).
export const windUniforms = { uTime: { value: 0 } };
function addWind(material, strength, heightScale) {
  material.onBeforeCompile = shader => {
    shader.uniforms.uTime = windUniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
        #else
          vec3 ip = vec3(0.0);
        #endif
        float hk = clamp(position.y * ${heightScale.toFixed(3)}, 0.0, 1.0);
        float w = sin(uTime * 1.7 + ip.x * 0.35 + ip.z * 0.27) * 0.6 + sin(uTime * 3.1 + ip.x * 0.9) * 0.25;
        transformed.x += w * ${strength.toFixed(3)} * hk * hk;
        transformed.z += w * ${(strength * 0.6).toFixed(3)} * hk * hk;`
      );
  };
  material.customProgramCacheKey = () => `wind-${strength}-${heightScale}`;
  return material;
}

const ni = g => (g.index ? g.toNonIndexed() : g);

const LEAF_COLORS = ['#ff9ec7', '#ffb0d4', '#6fcf6a', '#58b86b', '#ffb36b', '#ffd27a', '#b48cff'].map(c => new THREE.Color(c));

function useInstances(ref, items, build) {
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    items.forEach((it, i) => {
      build(it, m, c);
      mesh.setMatrixAt(i, m);
      if (mesh.instanceColor || c.__set) mesh.setColorAt(i, c);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [ref, items, build]);
}

function Trees() {
  const trees = useMemo(
    () =>
      scatter({
        seed: 11,
        minR: 0.42,
        maxR: 0.86,
        pad: 1.4,
        perIsland: I => (I.id === 'awards' ? 0 : I.id === 'spawn' ? 7 : Math.round(I.r * 0.75)),
      }),
    []
  );
  const trunks = useRef();
  const canopy = useRef();

  const trunkGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.2, 1.6, 6).translate(0, 0.8, 0), []);
  const canopyGeo = useMemo(() => {
    const a = new THREE.IcosahedronGeometry(1, 0).translate(0, 2.2, 0);
    const b = new THREE.IcosahedronGeometry(0.75, 0).translate(0.45, 2.85, 0.15);
    const c = new THREE.IcosahedronGeometry(0.6, 0).translate(-0.4, 2.7, -0.2);
    return mergeGeometries([ni(a), ni(b), ni(c)]);
  }, []);
  const canopyMat = useMemo(
    () => addWind(new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.8 }), 0.12, 0.3),
    []
  );

  useInstances(trunks, trees, (t, m) => {
    const s = 0.85 + t.rnd * 0.6;
    m.compose(new THREE.Vector3(t.x, t.y, t.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, t.rot, 0)), new THREE.Vector3(s, s, s));
  });
  useInstances(canopy, trees, (t, m, c) => {
    const s = 0.85 + t.rnd * 0.6;
    m.compose(new THREE.Vector3(t.x, t.y, t.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, t.rot, 0)), new THREE.Vector3(s, s, s));
    c.copy(LEAF_COLORS[Math.floor(t.rnd * 997) % LEAF_COLORS.length]);
    c.__set = true;
  });

  return (
    <>
      <instancedMesh ref={trunks} args={[trunkGeo, null, trees.length]} castShadow>
        <meshStandardMaterial color="#7a4b38" flatShading roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={canopy} args={[canopyGeo, canopyMat, trees.length]} castShadow receiveShadow>
        <instancedBufferAttribute attach="instanceColor" args={[new Float32Array(trees.length * 3), 3]} />
      </instancedMesh>
      <RigidBody type="fixed" colliders={false}>
        {trees.map((t, i) => {
          const s = 0.85 + t.rnd * 0.6;
          // canopy is solid too: the camera pulls in instead of clipping
          // through leaves, and treetops double as platforms
          return (
            <React.Fragment key={i}>
              <CylinderCollider args={[1, 0.3 * s]} position={[t.x, t.y + 1, t.z]} />
              <BallCollider args={[0.95 * s]} position={[t.x, t.y + 2.45 * s, t.z]} />
            </React.Fragment>
          );
        })}
      </RigidBody>
    </>
  );
}

function Grass({ density }) {
  const tufts = useMemo(
    () =>
      scatter({
        seed: 23,
        minR: 0.05,
        maxR: 0.97,
        pad: 0.25,
        perIsland: I => I.r * I.r * 0.9 * density,
      }),
    [density]
  );
  const ref = useRef();
  const geo = useMemo(() => {
    const blade = (rot, h) => {
      const g = new THREE.BufferGeometry();
      const w = 0.07;
      g.setAttribute('position', new THREE.Float32BufferAttribute([-w, 0, 0, w, 0, 0, 0, h, 0.04], 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
      g.rotateY(rot);
      return g;
    };
    const parts = [];
    for (let i = 0; i < 5; i++) {
      const b = blade(i * 1.26, 0.35 + (i % 3) * 0.12);
      b.translate(Math.cos(i * 2.4) * 0.12, 0, Math.sin(i * 2.4) * 0.12);
      parts.push(b);
    }
    return mergeGeometries(parts);
  }, []);
  const mat = useMemo(
    () => addWind(new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 1 }), 0.18, 2.2),
    []
  );
  useInstances(ref, tufts, (t, m, c) => {
    const s = 0.8 + t.rnd * 0.9;
    m.compose(new THREE.Vector3(t.x, t.y, t.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, t.rot, 0)), new THREE.Vector3(s, s, s));
    const isl = ISLANDS.find(i => i.id === t.island);
    c.set(isl.grass).offsetHSL(0, 0.05, -0.06 + t.rnd * 0.12);
    c.__set = true;
  });
  return (
    <instancedMesh ref={ref} args={[geo, mat, tufts.length]} receiveShadow>
      <instancedBufferAttribute attach="instanceColor" args={[new Float32Array(tufts.length * 3), 3]} />
    </instancedMesh>
  );
}

const FLOWER_COLORS = ['#ffffff', '#ffd166', '#ff7ac8', '#ff8a5b', '#b6a4ff'].map(c => new THREE.Color(c));

function Flowers({ density }) {
  const items = useMemo(
    () => scatter({ seed: 41, minR: 0.1, maxR: 0.95, pad: 0.35, perIsland: I => I.r * 2.2 * density }),
    [density]
  );
  const ref = useRef();
  const geo = useMemo(() => {
    const stem = new THREE.CylinderGeometry(0.015, 0.015, 0.32, 3).translate(0, 0.16, 0);
    const head = new THREE.IcosahedronGeometry(0.07, 0).translate(0, 0.34, 0);
    const s = ni(stem);
    const h = ni(head);
    return mergeGeometries([s, h]);
  }, []);
  const mat = useMemo(() => addWind(new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.6 }), 0.1, 2.5), []);
  useInstances(ref, items, (t, m, c) => {
    m.compose(new THREE.Vector3(t.x, t.y, t.z), new THREE.Quaternion(), new THREE.Vector3(1, 0.8 + t.rnd * 0.6, 1));
    c.copy(FLOWER_COLORS[Math.floor(t.rnd * 1000) % FLOWER_COLORS.length]);
    c.__set = true;
  });
  return (
    <instancedMesh ref={ref} args={[geo, mat, items.length]}>
      <instancedBufferAttribute attach="instanceColor" args={[new Float32Array(items.length * 3), 3]} />
    </instancedMesh>
  );
}

function Rocks() {
  const items = useMemo(
    () => scatter({ seed: 59, minR: 0.6, maxR: 0.95, pad: 0.9, perIsland: I => (I.id === 'awards' ? 3 : Math.round(I.r * 0.35)) }),
    []
  );
  const ref = useRef();
  useInstances(ref, items, (t, m, c) => {
    const s = 0.35 + t.rnd * 0.55;
    m.compose(
      new THREE.Vector3(t.x, t.y + s * 0.2, t.z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(t.rnd * 2, t.rot, t.rnd)),
      new THREE.Vector3(s * 1.3, s, s * 1.1)
    );
    c.set('#9d8aa8').offsetHSL(0, 0, (t.rnd - 0.5) * 0.15);
    c.__set = true;
  });
  return (
    <>
      <instancedMesh ref={ref} args={[null, null, items.length]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial flatShading roughness={0.95} />
        <instancedBufferAttribute attach="instanceColor" args={[new Float32Array(items.length * 3), 3]} />
      </instancedMesh>
      <RigidBody type="fixed" colliders={false}>
        {items.map((t, i) => (
          <CylinderCollider key={i} args={[0.4, (0.35 + t.rnd * 0.55) * 1.0]} position={[t.x, t.y + 0.2, t.z]} />
        ))}
      </RigidBody>
    </>
  );
}

// Small rocks orbiting below each island for depth and motion.
function DebrisRing() {
  const ref = useRef();
  const items = useMemo(() => {
    const rnd = mulberry32(5);
    const list = [];
    ISLANDS.forEach(I => {
      for (let i = 0; i < 6; i++) {
        list.push({
          I,
          a: rnd() * Math.PI * 2,
          r: I.r + 2 + rnd() * 4,
          y: I.y - 2 - rnd() * 6,
          s: 0.3 + rnd() * 0.7,
          sp: (0.05 + rnd() * 0.1) * (rnd() > 0.5 ? 1 : -1),
          bob: rnd() * 6,
        });
      }
    });
    return list;
  }, []);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const e = useMemo(() => new THREE.Euler(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const sc = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    items.forEach((d, i) => {
      const a = d.a + t * d.sp;
      v.set(d.I.x + Math.cos(a) * d.r, d.y + Math.sin(t * 0.8 + d.bob) * 0.4, d.I.z + Math.sin(a) * d.r);
      e.set(t * d.sp * 3, a, 0);
      q.setFromEuler(e);
      sc.setScalar(d.s);
      m.compose(v, q, sc);
      ref.current.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[null, null, items.length]} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#8a6a8f" flatShading roughness={1} />
    </instancedMesh>
  );
}

export default function Foliage({ tier }) {
  const density = tier === 'low' ? 0.35 : tier === 'medium' ? 0.65 : 1;
  useFrame((_, dt) => {
    windUniforms.uTime.value += dt;
  });
  return (
    <>
      <Trees />
      <Rocks />
      <Grass density={density} />
      <Flowers density={density} />
      <DebrisRing />
    </>
  );
}
