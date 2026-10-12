import React, { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { NAME_ROW, INTERACTABLES } from '../core/layout';
import { emit, on } from '../core/events';
import { toast } from '../core/store';
import { award } from './Gameplay';
import Clickable from './Clickable';

export const FONT_BOLD = '/game/fonts/spacegrotesk-bold.ttf';
export const FONT_MED = '/game/fonts/spacegrotesk-medium.ttf';
export const FONT_DISPLAY = '/game/fonts/orbitron-black.ttf';
const TYPEFACE = '/game/fonts/orbitron-black.typeface.json';

const LETTER_COLORS = ['#ff8a52', '#ffd166', '#63e7de', '#ff7ac8', '#9d8cff', '#7ccf6a'];

// One dynamic rigid body per letter. The robot shoves them around via the
// character controller's impulses; anything knocked off the island respawns.
function Letter({ char, geo, size, position, color, index }) {
  const body = useRef();
  const home = useMemo(() => position.slice(), [position]);
  const knocked = useRef(false);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.32, metalness: 0.15, emissive: color, emissiveIntensity: 0.08 }),
    [color]
  );
  useFrame(() => {
    const b = body.current;
    if (!b) return;
    const t = b.translation();
    if (t.y < -30) {
      b.setTranslation({ x: home[0], y: home[1] + 6, z: home[2] }, true);
      b.setLinvel({ x: 0, y: 0, z: 0 }, true);
      b.setAngvel({ x: 0, y: 0, z: 0 }, true);
      b.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    }
    if (!knocked.current) {
      const r = b.rotation();
      // tipped more than ~50° from upright
      if (1 - 2 * (r.x * r.x + r.z * r.z) < 0.64) {
        knocked.current = true;
        emit('letterKnocked', { index });
      }
    }
  });
  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={position}
      linearDamping={0.4}
      angularDamping={0.6}
      friction={0.9}
      restitution={0.15}
    >
      <CuboidCollider args={[size.x / 2, size.y / 2, size.z / 2]} density={14} />
      <mesh geometry={geo} material={mat} castShadow receiveShadow />
    </RigidBody>
  );
}

export function NameLetters() {
  const font = useLoader(FontLoader, TYPEFACE);
  const letters = useMemo(() => {
    const out = [];
    const { z, gap, size, spacing, words } = NAME_ROW;
    words.forEach((word, w) => {
      const totalW = word.length * spacing;
      const startX = w === 0 ? -gap - totalW + spacing / 2 : gap + spacing / 2;
      word.split('').forEach((ch, i) => {
        const geo = new TextGeometry(ch, {
          font,
          size,
          depth: 0.42,
          curveSegments: 3,
          bevelEnabled: true,
          bevelThickness: 0.04,
          bevelSize: 0.03,
          bevelSegments: 2,
        });
        geo.computeBoundingBox();
        const bb = geo.boundingBox;
        const sz = new THREE.Vector3();
        bb.getSize(sz);
        geo.translate(-(bb.min.x + sz.x / 2), -(bb.min.y + sz.y / 2), -(bb.min.z + sz.z / 2));
        const idx = out.length;
        out.push({
          id: `${w}-${i}`,
          char: ch,
          geo,
          size: sz,
          position: [startX + i * spacing, sz.y / 2 + 0.02, z + (w === 0 ? (i - 3) * (i - 3) * 0.06 : (i - 2) * (i - 2) * 0.06)],
          color: LETTER_COLORS[idx % LETTER_COLORS.length],
          index: idx,
        });
      });
    });
    return out;
  }, [font]);
  return letters.map(({ id, ...l }) => <Letter key={id} {...l} />);
}

export function LetterTracker() {
  const count = useRef(0);
  React.useEffect(() => {
    const total = NAME_ROW.words.join('').length;
    const off = on('letterKnocked', () => {
      count.current += 1;
      if (count.current === 3) award('wrecking');
      if (count.current === total) toast({ kind: 'info', title: 'Total demolition', body: 'Every letter down. Sushant is proud, probably.' });
    });
    return off;
  }, []);
  return null;
}

// ---------------------------------------------------------------------
function Signpost({ x, y, z }) {
  return (
    <group position={[x, y, z]} rotation={[0, Math.atan2(-x, -z) + Math.PI, 0]}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2, 8]} />
        <meshStandardMaterial color="#7a4e32" />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <boxGeometry args={[2.3, 1.1, 0.12]} />
        <meshStandardMaterial color="#f6e7c8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.75, -0.07]}>
        <boxGeometry args={[2.4, 1.2, 0.04]} />
        <meshStandardMaterial color="#a8714a" />
      </mesh>
      <Text font={FONT_BOLD} fontSize={0.2} color="#3b2a1e" position={[0, 2.03, 0.07]} anchorX="center">
        HOW TO PLAY
      </Text>
      <Text font={FONT_MED} fontSize={0.13} color="#5b4130" position={[0, 1.66, 0.07]} anchorX="center" textAlign="center" lineHeight={1.4} maxWidth={2.1}>
        {'Move · Jump · Double jump\nDash · Walk up to things & read'}
      </Text>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[1, 0.12]} position={[0, 1, 0]} />
      </RigidBody>
    </group>
  );
}

const portalVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const portalFrag = /* glsl */ `
  uniform float uTime; varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);
    float swirl = sin(a * 5.0 + r * 12.0 - uTime * 3.0) * 0.5 + 0.5;
    vec3 c1 = vec3(0.39, 0.91, 0.87); vec3 c2 = vec3(0.62, 0.35, 1.0);
    vec3 col = mix(c1, c2, swirl) * (1.4 - r) * 1.8;
    float alpha = smoothstep(1.0, 0.82, r) * (0.55 + swirl * 0.45);
    gl_FragColor = vec4(col, alpha);
  }
`;

function Portal({ x, y, z }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: portalVert,
        fragmentShader: portalFrag,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
        uniforms: { uTime: { value: 0 } },
      }),
    []
  );
  const ring = useRef();
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    ring.current.rotation.z += dt * 0.4;
  });
  const face = Math.atan2(-x, -z) + Math.PI;
  return (
    <group position={[x, y, z]} rotation={[0, face, 0]}>
      <mesh position={[0, 1.7, 0]} material={mat}>
        <circleGeometry args={[1.25, 48]} />
      </mesh>
      <mesh ref={ring} position={[0, 1.7, 0]} castShadow>
        <torusGeometry args={[1.35, 0.12, 12, 48]} />
        <meshStandardMaterial color="#2a2f55" metalness={0.7} roughness={0.25} emissive="#63e7de" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.24, 24]} />
        <meshStandardMaterial color="#c9b9d9" roughness={0.6} />
      </mesh>
      <Text font={FONT_BOLD} fontSize={0.22} color="#ffffff" position={[0, 3.35, 0]} anchorX="center" outlineWidth={0.012} outlineColor="#2a2f55">
        CLASSIC PORTFOLIO
      </Text>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.2, 1.5, 0.2]} position={[-1.35, 1.6, 0]} />
        <CuboidCollider args={[0.2, 1.5, 0.2]} position={[1.35, 1.6, 0]} />
      </RigidBody>
    </group>
  );
}

export default function Spawn() {
  const howto = INTERACTABLES.find(i => i.id === 'howto');
  const classic = INTERACTABLES.find(i => i.id === 'classic');
  return (
    <>
      <React.Suspense fallback={null}>
        <NameLetters />
      </React.Suspense>
      <LetterTracker />
      <Clickable id="howto">
        <Signpost {...howto} />
      </Clickable>
      <Clickable id="classic">
        <Portal {...classic} />
      </Clickable>
    </>
  );
}
