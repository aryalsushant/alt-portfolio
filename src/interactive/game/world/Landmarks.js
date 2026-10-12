import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard, RoundedBox, useTexture } from '@react-three/drei';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { ZONES, INTERACTABLES, CRYSTALS, MONOLITHS, CABINETS, LANDMARKS, islandById } from '../core/layout';
import { PROFILE, RESEARCH, AWARDS } from '../../content';
import { FONT_BOLD, FONT_MED, FONT_DISPLAY } from './Spawn';
import Blocker from './Blocker';
import Clickable from './Clickable';

const glow = (hex, k = 2.2) => new THREE.Color(hex).multiplyScalar(k);
const find = id => INTERACTABLES.find(i => i.id === id);

// Big floating zone titles — readable from neighbouring islands.
export function ZoneTitles() {
  return ZONES.filter(z => z.id !== 'spawn').map(z => (
    <Billboard key={z.id} position={[z.x, z.y + (z.id === 'awards' ? 7.5 : 8.5), z.z]}>
      <Text
        font={FONT_DISPLAY}
        fontSize={z.id === 'awards' ? 1.1 : 1.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor={z.color}
        outlineOpacity={0.9}
        letterSpacing={0.06}
      >
        {z.name.toUpperCase()}
      </Text>
    </Billboard>
  ));
}

// ---------------------------------------------------------------------
// About Grove
// ---------------------------------------------------------------------
function Shrine() {
  const it = find('about');
  const orb = useRef();
  const rings = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    orb.current.position.y = 2.7 + Math.sin(t * 1.3) * 0.15;
    rings.current.rotation.y = t * 0.6;
    rings.current.rotation.x = Math.sin(t * 0.4) * 0.3;
  });
  return (
    <group position={[it.x, it.y, it.z]}>
      {[1.7, 1.25, 0.85].map((r, i) => (
        <mesh key={r} position={[0, 0.15 + i * 0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[r, r + 0.1, 0.3, 8]} />
          <meshStandardMaterial color={['#d9cbe8', '#c4b3d8', '#b19ec9'][i]} flatShading roughness={0.7} />
        </mesh>
      ))}
      <group ref={orb} position={[0, 2.7, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial color="#8fd46b" emissive="#8fd46b" emissiveIntensity={1.8} flatShading toneMapped={false} />
        </mesh>
        <group ref={rings}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.85, 0.025, 8, 48]} />
            <meshBasicMaterial color={glow('#ffffff', 1.6)} toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 3, 0.4, 0]}>
            <torusGeometry args={[1.05, 0.02, 8, 48]} />
            <meshBasicMaterial color={glow('#ffd166', 2)} toneMapped={false} />
          </mesh>
        </group>
      </group>
      <Billboard position={[0, 4.05, 0]}>
        <Text font={FONT_BOLD} fontSize={0.42} color="#ffffff" anchorX="center" outlineWidth={0.02} outlineColor="#2a2f55">
          {PROFILE.name.toUpperCase()}
        </Text>
        <Text font={FONT_MED} fontSize={0.2} color="#f3e9ff" anchorX="center" position={[0, -0.38, 0]} outlineWidth={0.012} outlineColor="#2a2f55">
          {PROFILE.role}
        </Text>
      </Billboard>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.45, 1.7]} position={[0, 0.45, 0]} />
      </RigidBody>
    </group>
  );
}

function MonkBot() {
  const it = find('monk');
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.position.y = 1.3 + Math.sin(t * 1.1) * 0.18;
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.15;
  });
  const face = Math.atan2(islandById.about.x - it.x, islandById.about.z - it.z);
  return (
    <group position={[it.x, it.y, it.z]} rotation={[0, face, 0]}>
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 1, 0.12, 20]} />
        <meshStandardMaterial color="#e8d3a8" roughness={1} />
      </mesh>
      <group ref={ref} scale={0.8}>
        {/* crossed legs */}
        <mesh position={[0, 0, 0]} scale={[1, 0.35, 0.75]} castShadow>
          <sphereGeometry args={[0.55, 16, 10]} />
          <meshStandardMaterial color="#aab4cc" roughness={0.45} metalness={0.3} />
        </mesh>
        <RoundedBox args={[0.6, 0.5, 0.44]} radius={0.12} position={[0, 0.42, 0]} castShadow>
          <meshStandardMaterial color="#ff8a52" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[0.74, 0.5, 0.56]} radius={0.17} position={[0, 0.98, 0]} castShadow>
          <meshStandardMaterial color="#eef1f8" roughness={0.25} />
        </RoundedBox>
        <RoundedBox args={[0.58, 0.32, 0.06]} radius={0.1} position={[0, 0.98, 0.26]}>
          <meshStandardMaterial color="#141a30" roughness={0.2} metalness={0.5} />
        </RoundedBox>
        {[-0.12, 0.12].map(x => (
          <mesh key={x} position={[x, 0.97, 0.3]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.045, 0.014, 6, 12, Math.PI]} />
            <meshBasicMaterial color={glow('#6ff7ee', 2.4)} toneMapped={false} />
          </mesh>
        ))}
        {/* arms resting on knees */}
        {[-1, 1].map(s => (
          <mesh key={s} position={[s * 0.38, 0.25, 0.12]} rotation={[0.9, 0, s * 0.5]} castShadow>
            <capsuleGeometry args={[0.07, 0.3, 4, 8]} />
            <meshStandardMaterial color="#aab4cc" />
          </mesh>
        ))}
        {/* halo */}
        <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.32, 0.03, 8, 32]} />
          <meshBasicMaterial color={glow('#ffd166', 2.5)} toneMapped={false} />
        </mesh>
      </group>
      <Billboard position={[0, 2.85, 0]}>
        <Text font={FONT_DISPLAY} fontSize={0.26} color="#ff7ac8" anchorX="center" outlineWidth={0.015} outlineColor="#ffffff">
          {PROFILE.ribbon}
        </Text>
        <Text font={FONT_MED} fontSize={0.13} color="#ffffff" anchorX="center" position={[0, -0.26, 0]} outlineWidth={0.01} outlineColor="#2a2f55">
          stress levels: unmeasurable
        </Text>
      </Billboard>
    </group>
  );
}

// ---------------------------------------------------------------------
// Skill Crystals
// ---------------------------------------------------------------------
function Crystal({ c }) {
  const group = useRef();
  const orbit = useRef();
  const shards = useMemo(() => {
    const out = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const big = i === 0;
      out.push({
        p: big ? [0, 1.5, 0] : [Math.cos(a) * 0.6, 0.7, Math.sin(a) * 0.6],
        r: big ? [0, 0, 0] : [Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5],
        s: big ? [0.7, 1.9, 0.7] : [0.35, 0.9 + (i % 3) * 0.25, 0.35],
      });
    }
    return out;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: c.data.color,
        emissive: c.data.color,
        emissiveIntensity: 0.9,
        roughness: 0.15,
        metalness: 0.2,
        flatShading: true,
        transparent: true,
        opacity: 0.92,
      }),
    [c]
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current.rotation.y = t * 0.25;
    orbit.current.rotation.y = -t * 0.35;
    mat.emissiveIntensity = 0.8 + Math.sin(t * 2 + c.x) * 0.25;
  });
  const items = c.data.items;
  return (
    <group position={[c.x, c.y, c.z]}>
      <group ref={group}>
        {shards.map((s, i) => (
          <mesh key={i} position={s.p} rotation={s.r} scale={s.s} material={mat} castShadow>
            <octahedronGeometry args={[1, 0]} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 7]} />
        <meshStandardMaterial color="#5d4a7a" flatShading />
      </mesh>
      <group ref={orbit} position={[0, 1.6, 0]}>
        {items.map((name, i) => {
          const a = (i / items.length) * Math.PI * 2;
          return (
            <Billboard key={name} position={[Math.cos(a) * 2.05, Math.sin(i * 1.7) * 0.5, Math.sin(a) * 2.05]}>
              <Text font={FONT_BOLD} fontSize={0.2} color="#ffffff" anchorX="center" outlineWidth={0.018} outlineColor={c.data.color}>
                {name}
              </Text>
            </Billboard>
          );
        })}
      </group>
      <Billboard position={[0, 3.9, 0]}>
        <Text font={FONT_DISPLAY} fontSize={0.3} color={c.data.color} anchorX="center" outlineWidth={0.02} outlineColor="#1b1838">
          {c.data.group.toUpperCase()}
        </Text>
      </Billboard>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[1.3, 0.95]} position={[0, 1.3, 0]} />
      </RigidBody>
    </group>
  );
}

// ---------------------------------------------------------------------
// Career Monoliths
// ---------------------------------------------------------------------
// Pillar scale factors: big enough to read from neighbouring islands.
export const MONOLITH_K = 1.35;
export const CABINET_K = 1.3;
export const TOWER_K = 1.25;

function Monolith({ m }) {
  const emblem = useRef();
  const e = m.data;
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    emblem.current.rotation.y = t * 0.8;
    emblem.current.position.y = 5.25 + Math.sin(t * 1.4 + m.x) * 0.12;
  });
  return (
    <group position={[m.x, m.y, m.z]} rotation={[0, m.face, 0]}>
      <group scale={MONOLITH_K}>
      <RoundedBox args={[2.7, 4.4, 0.7]} radius={0.12} position={[0, 2.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2b2747" roughness={0.55} metalness={0.25} />
      </RoundedBox>
      {/* glowing edge strips */}
      {[-1.36, 1.36].flatMap(x => [0.33, -0.33].map(z => [x, z])).map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 2.2, z]}>
          <boxGeometry args={[0.05, 4.2, 0.05]} />
          <meshBasicMaterial color={glow(e.color, 2.6)} toneMapped={false} />
        </mesh>
      ))}
      {/* engraved on both faces so the board reads from either side */}
      {[0, Math.PI].map(ry => (
        <group key={ry} rotation={[0, ry, 0]}>
          <mesh position={[0, 4.15, 0.36]}>
            <boxGeometry args={[2.3, 0.05, 0.02]} />
            <meshBasicMaterial color={glow(e.color, 2.6)} toneMapped={false} />
          </mesh>
          <Text font={FONT_DISPLAY} fontSize={e.short.length > 14 ? 0.25 : 0.32} maxWidth={2.4} textAlign="center" color={e.color} position={[0, 3.95, 0.37]} anchorX="center" anchorY="top" lineHeight={1.1}>
            {e.short}
          </Text>
          <Text font={FONT_BOLD} fontSize={0.23} maxWidth={2.35} textAlign="center" color="#ffffff" position={[0, 2.95, 0.37]} anchorX="center" anchorY="top" lineHeight={1.2}>
            {e.title}
          </Text>
          <Text font={FONT_MED} fontSize={0.19} color="#cfc7ef" position={[0, 2.0, 0.37]} anchorX="center" anchorY="top">
            {e.dates}
          </Text>
          <Text font={FONT_MED} fontSize={0.17} color="#9d93c9" position={[0, 1.62, 0.37]} anchorX="center" anchorY="top">
            {e.location}
          </Text>
        </group>
      ))}
      <group ref={emblem} position={[0, 5.25, 0]}>
        <mesh>
          <torusKnotGeometry args={[0.3, 0.09, 64, 8]} />
          <meshStandardMaterial color={e.color} emissive={e.color} emissiveIntensity={1.4} toneMapped={false} metalness={0.4} roughness={0.2} />
        </mesh>
      </group>
      </group>
      <RigidBody type="fixed" colliders={false}>
        <Blocker shape={CuboidCollider} args={[1.35 * MONOLITH_K, 2.2 * MONOLITH_K, 0.35 * MONOLITH_K]} position={[0, 2.2 * MONOLITH_K, 0]} />
      </RigidBody>
    </group>
  );
}

// ---------------------------------------------------------------------
// Project Arcade
// ---------------------------------------------------------------------
function ScreenImage({ src }) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh position={[0, 0, 0.002]}>
      <planeGeometry args={[1.02, 0.76]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

const screenFrag = /* glsl */ `
  uniform float uTime; uniform vec3 uColor; varying vec2 vUv;
  void main() {
    float scan = 0.85 + 0.15 * sin(vUv.y * 180.0 - uTime * 6.0);
    float grid = step(0.96, fract(vUv.x * 12.0)) + step(0.96, fract(vUv.y * 9.0 + uTime * 0.4));
    vec3 col = mix(vec3(0.03, 0.03, 0.08), uColor * 0.55, smoothstep(1.1, 0.0, length(vUv - 0.5) * 1.6));
    col += uColor * grid * 0.25;
    gl_FragColor = vec4(col * scan * 1.6, 1.0);
  }
`;

function Cabinet({ c }) {
  const p = c.data;
  const screenMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: screenFrag,
        toneMapped: false,
        uniforms: { uTime: { value: Math.random() * 10 }, uColor: { value: new THREE.Color(p.color) } },
      }),
    [p.color]
  );
  useFrame((_, dt) => {
    screenMat.uniforms.uTime.value += dt;
  });
  return (
    <group position={[c.x, c.y, c.z]} rotation={[0, c.face, 0]}>
      <group scale={CABINET_K}>
      {/* body */}
      <RoundedBox args={[1.35, 2.3, 1.05]} radius={0.06} position={[0, 1.15, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e1b38" roughness={0.45} metalness={0.3} />
      </RoundedBox>
      {/* side art stripes */}
      {[-0.68, 0.68].map(x => (
        <mesh key={x} position={[x, 1.2, 0]}>
          <boxGeometry args={[0.02, 2.1, 0.9]} />
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* marquee */}
      <mesh position={[0, 2.18, 0.42]}>
        <boxGeometry args={[1.2, 0.34, 0.2]} />
        <meshBasicMaterial color={glow(p.color, 1.6)} toneMapped={false} />
      </mesh>
      <Text font={FONT_DISPLAY} fontSize={p.name.length > 12 ? 0.11 : 0.15} color="#14122a" position={[0, 2.18, 0.53]} anchorX="center" anchorY="middle" maxWidth={1.1}>
        {p.name.toUpperCase()}
      </Text>
      {/* screen, tilted back */}
      <group position={[0, 1.55, 0.5]} rotation={[-0.22, 0, 0]}>
        <mesh material={screenMat}>
          <planeGeometry args={[1.08, 0.82]} />
        </mesh>
        {p.image ? (
          <Suspense fallback={null}>
            <ScreenImage src={p.image} />
          </Suspense>
        ) : (
          <>
            <Text font={FONT_DISPLAY} fontSize={p.name.length > 12 ? 0.09 : 0.13} color="#ffffff" position={[0, 0.08, 0.01]} anchorX="center" anchorY="middle" maxWidth={0.95} textAlign="center">
              {p.name.toUpperCase()}
            </Text>
            <Text font={FONT_MED} fontSize={0.06} color="#ffffff" position={[0, -0.16, 0.01]} anchorX="center" anchorY="middle" fillOpacity={0.85}>
              PRESS START
            </Text>
          </>
        )}
      </group>
      {/* control deck */}
      <mesh position={[0, 1.0, 0.68]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[1.25, 0.08, 0.5]} />
        <meshStandardMaterial color="#2c2852" />
      </mesh>
      <mesh position={[-0.3, 1.1, 0.7]}>
        <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[-0.3, 1.2, 0.7]}>
        <sphereGeometry args={[0.055, 12, 8]} />
        <meshStandardMaterial color="#ff5d73" />
      </mesh>
      {['#ffd166', '#63e7de', '#ff7ac8'].map((col, i) => (
        <mesh key={col} position={[0.08 + i * 0.16, 1.08, 0.7 - (i % 2) * 0.06]} rotation={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.03, 12]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.7} />
        </mesh>
      ))}
      <Billboard position={[0, 2.85, 0]}>
        <Text font={FONT_MED} fontSize={0.19} color="#ffffff" anchorX="center" outlineWidth={0.014} outlineColor="#1b1838" maxWidth={2.6} textAlign="center">
          {p.tagline}
        </Text>
      </Billboard>
      </group>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.68 * CABINET_K, 1.15 * CABINET_K, 0.53 * CABINET_K]} position={[0, 1.15 * CABINET_K, 0]} />
      </RigidBody>
    </group>
  );
}

// ---------------------------------------------------------------------
// Observatory (research)
// ---------------------------------------------------------------------
function Observatory() {
  const I = islandById.research;
  const scope = useRef();
  const pages = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    scope.current.rotation.y = Math.sin(t * 0.15) * 0.6;
    pages.current.rotation.y = t * 0.3;
  });
  return (
    <group position={[I.x, I.y, I.z]}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.6, 2.8, 2, 20]} />
        <meshStandardMaterial color="#e7e0f2" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.6, 2.62]}>
        <boxGeometry args={[1, 1.6, 0.1]} />
        <meshStandardMaterial color="#3b3363" />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[2.55, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cfd6ea" metalness={0.5} roughness={0.25} />
      </mesh>
      <group ref={scope} position={[0, 3.4, 0]}>
        <mesh position={[0, 0.9, 0.9]} rotation={[-0.75, 0, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.42, 3.2, 16]} />
          <meshStandardMaterial color="#3b3363" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.05, 2.05]} rotation={[-0.75, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.06, 20]} />
          <meshBasicMaterial color={glow('#9d8cff', 2.4)} toneMapped={false} />
        </mesh>
      </group>
      <group ref={pages} position={[0, 2.2, 0]}>
        {[0, 1, 2, 3].map(i => {
          const a = (i / 4) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(a) * 3.9, Math.sin(i * 2) * 0.4 + 0.6, Math.sin(a) * 3.9]} rotation={[0, -a + Math.PI / 2, 0.15]}>
              <mesh>
                <planeGeometry args={[0.75, 1]} />
                <meshStandardMaterial color="#fffaf0" emissive="#fff6e0" emissiveIntensity={0.35} side={THREE.DoubleSide} />
              </mesh>
              {[0.3, 0.18, 0.06, -0.06, -0.18, -0.3].map(y => (
                <mesh key={y} position={[0, y, 0.005]}>
                  <planeGeometry args={[0.55, 0.035]} />
                  <meshBasicMaterial color="#8a84b8" />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>
      <Billboard position={[0, 6.4, 0]}>
        <Text font={FONT_BOLD} fontSize={0.3} color="#ffffff" anchorX="center" outlineWidth={0.02} outlineColor="#5b4bb3">
          {RESEARCH.venue.split(' (')[0]}
        </Text>
      </Billboard>
      <RigidBody type="fixed" colliders={false}>
        <Blocker shape={CylinderCollider} args={[2, 2.8]} position={[0, 2, 0]} />
      </RigidBody>
    </group>
  );
}

// ---------------------------------------------------------------------
// Academy (education)
// ---------------------------------------------------------------------
function LogoPlate({ src, w = 1.4, h = 1.4 }) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

// Education towers carry their plaque on all four faces, so they read from
// whichever side the player comes from.
const FACES = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

function USMFace({ e }) {
  return (
    <>
      <group position={[0, 3.9, 1.22]}>
        <mesh position={[0, 0, -0.005]}>
          <planeGeometry args={[1.8, 1.8]} />
          <meshStandardMaterial color="#f5f0e0" />
        </mesh>
        <Suspense fallback={null}>
          <LogoPlate src={e.logo} w={1.5} h={1.5} />
        </Suspense>
      </group>
      <Text font={FONT_DISPLAY} fontSize={0.22} color="#ffc72c" position={[0, 2.55, 1.22]} anchorX="center">
        {e.short}
      </Text>
      <Text font={FONT_BOLD} fontSize={0.18} color="#ffffff" position={[0, 2.2, 1.22]} anchorX="center">
        {e.degree}
      </Text>
      <Text font={FONT_DISPLAY} fontSize={0.34} color="#ffffff" position={[0, 1.45, 1.22]} anchorX="center" outlineWidth={0.02} outlineColor="#ffc72c">
        GPA 4.0
      </Text>
    </>
  );
}

function USMTower({ l }) {
  const e = l.data;
  return (
    <group position={[l.x, l.y, l.z]} rotation={[0, l.face, 0]}>
      <group scale={TOWER_K}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.6, 3.4]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 4.8, 2.4]} />
        <meshStandardMaterial color="#1d1d1f" roughness={0.6} />
      </mesh>
      {[[-1.21, 1.21], [1.21, 1.21], [-1.21, -1.21], [1.21, -1.21]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 3, z]}>
          <boxGeometry args={[0.1, 4.8, 0.1]} />
          <meshBasicMaterial color={glow('#ffc72c', 2)} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 5.9, 0]} castShadow>
        <coneGeometry args={[1.9, 1.8, 4]} />
        <meshStandardMaterial color="#ffc72c" metalness={0.6} roughness={0.3} />
      </mesh>
      {FACES.map(r => (
        <group key={r} rotation={[0, r, 0]}>
          <USMFace e={e} />
        </group>
      ))}
      </group>
      <RigidBody type="fixed" colliders={false}>
        <Blocker shape={CuboidCollider} args={[1.7 * TOWER_K, 3.3 * TOWER_K, 1.7 * TOWER_K]} position={[0, 3.3 * TOWER_K, 0]} />
      </RigidBody>
    </group>
  );
}

function CornellFace({ e, handRef }) {
  return (
    <>
      <group position={[0, 6.2, 0.96]}>
        <mesh>
          <circleGeometry args={[0.7, 32]} />
          <meshStandardMaterial color="#fff8e8" emissive="#fff1c9" emissiveIntensity={0.6} />
        </mesh>
        <mesh ref={handRef} position={[0, 0, 0.01]}>
          <planeGeometry args={[0.06, 1.1]} />
          <meshBasicMaterial color="#2b2b2b" />
        </mesh>
      </group>
      <group position={[0, 3.6, 0.96]}>
        <mesh position={[0, 0, -0.005]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <Suspense fallback={null}>
          <LogoPlate src={e.logo} w={1.3} h={1.3} />
        </Suspense>
      </group>
      <Text font={FONT_DISPLAY} fontSize={0.22} color="#ffffff" position={[0, 2.4, 0.96]} anchorX="center" outlineWidth={0.015} outlineColor="#b31b1b">
        {e.short}
      </Text>
      <Text font={FONT_BOLD} fontSize={0.16} color="#ffffff" position={[0, 2.2, 0.96]} anchorX="center" anchorY="top" maxWidth={1.75} textAlign="center" lineHeight={1.2}>
        {e.degree}
      </Text>
    </>
  );
}

function CornellTower({ l }) {
  const e = l.data;
  const hands = useRef([]);
  useFrame(({ clock }) => {
    hands.current.forEach(h => {
      if (h) h.rotation.z = -clock.elapsedTime * 0.5;
    });
  });
  return (
    <group position={[l.x, l.y, l.z]} rotation={[0, l.face, 0]}>
      <group scale={TOWER_K}>
      <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 7.2, 1.9]} />
        <meshStandardMaterial color="#9c6b55" roughness={0.85} />
      </mesh>
      <mesh position={[0, 7.4, 0]} castShadow>
        <boxGeometry args={[2.2, 0.4, 2.2]} />
        <meshStandardMaterial color="#e8dccb" />
      </mesh>
      <mesh position={[0, 8.9, 0]} castShadow>
        <coneGeometry args={[1.45, 2.6, 4]} />
        <meshStandardMaterial color="#5d6a74" metalness={0.3} roughness={0.5} />
      </mesh>
      {FACES.map((r, i) => (
        <group key={r} rotation={[0, r, 0]}>
          <CornellFace e={e} handRef={h => (hands.current[i] = h)} />
        </group>
      ))}
      </group>
      <RigidBody type="fixed" colliders={false}>
        <Blocker shape={CuboidCollider} args={[1.1 * TOWER_K, 4.6 * TOWER_K, 1.1 * TOWER_K]} position={[0, 4.6 * TOWER_K, 0]} />
      </RigidBody>
    </group>
  );
}

// British K6-style telephone box: the contact point.
const BOOTH_RED = '#c8102e';
const PANES = Array.from({ length: 18 }, (_, i) => [((i % 3) - 1) * 0.36, 1.05 + Math.floor(i / 3) * 0.34]);

function BoothSide({ front }) {
  return (
    <>
      {/* window panes lit from inside */}
      {PANES.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.79]}>
          <planeGeometry args={[0.3, 0.28]} />
          <meshBasicMaterial color={glow('#ffe7a8', 1.15)} toneMapped={false} />
        </mesh>
      ))}
      {/* illuminated TELEPHONE header */}
      <mesh position={[0, 3.18, 0.86]}>
        <planeGeometry args={[1.25, 0.26]} />
        <meshBasicMaterial color={glow('#fff8e6', 1.4)} toneMapped={false} />
      </mesh>
      <Text font={FONT_BOLD} fontSize={0.17} letterSpacing={0.08} color="#111111" position={[0, 3.18, 0.87]} anchorX="center" anchorY="middle">
        TELEPHONE
      </Text>
      {/* crown */}
      <mesh position={[0, 3.62, 0.84]}>
        <circleGeometry args={[0.13, 20]} />
        <meshStandardMaterial color="#ffd166" metalness={0.8} roughness={0.25} />
      </mesh>
      {front && (
        <>
          <mesh position={[0.62, 1.75, 0.82]}>
            <boxGeometry args={[0.05, 0.3, 0.05]} />
            <meshStandardMaterial color="#d9c38a" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.62, 0.8]}>
            <planeGeometry args={[0.95, 0.24]} />
            <meshBasicMaterial color="#fff8e6" />
          </mesh>
          <Text font={FONT_DISPLAY} fontSize={0.1} color={BOOTH_RED} position={[0, 0.62, 0.81]} anchorX="center" anchorY="middle">
            CALL SUSHANT
          </Text>
        </>
      )}
    </>
  );
}

function PhoneBooth() {
  return (
    <group>
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.95, 0.18, 1.95]} />
        <meshStandardMaterial color="#6d6d70" roughness={0.9} />
      </mesh>
      {/* glazed body with red glazing bars, inside is warm light */}
      <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.56, 3.44, 1.56]} />
        <meshStandardMaterial color={BOOTH_RED} roughness={0.45} metalness={0.1} />
      </mesh>
      {/* corner posts */}
      {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x * 0.78, 1.95, z * 0.78]} castShadow>
          <boxGeometry args={[0.22, 3.55, 0.22]} />
          <meshStandardMaterial color={BOOTH_RED} roughness={0.45} />
        </mesh>
      ))}
      {/* header band, cornice and domed roof */}
      <mesh position={[0, 3.18, 0]} castShadow>
        <boxGeometry args={[1.7, 0.44, 1.7]} />
        <meshStandardMaterial color={BOOTH_RED} roughness={0.45} />
      </mesh>
      <mesh position={[0, 3.45, 0]} castShadow>
        <boxGeometry args={[1.82, 0.1, 1.82]} />
        <meshStandardMaterial color={BOOTH_RED} roughness={0.45} />
      </mesh>
      <mesh position={[0, 3.5, 0]} scale={[1, 0.42, 1]} castShadow>
        <sphereGeometry args={[1.12, 4, 6, Math.PI / 4, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={BOOTH_RED} roughness={0.45} flatShading />
      </mesh>
      {FACES.map((r, i) => (
        <group key={r} rotation={[0, r, 0]}>
          <BoothSide front={i === 0} />
        </group>
      ))}
      <RigidBody type="fixed" colliders={false}>
        <Blocker shape={CuboidCollider} args={[0.92, 1.9, 0.92]} position={[0, 1.9, 0]} />
      </RigidBody>
    </group>
  );
}

// ---------------------------------------------------------------------
// Signal Tower (contact)
// ---------------------------------------------------------------------
function SignalTower() {
  const I = islandById.contact;
  const it = find('contact');
  const beacon = useRef();
  const dish = useRef();
  const waves = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    beacon.current.material.color.copy(glow('#ff3b3b', Math.sin(t * 4) > 0 ? 4 : 0.4));
    dish.current.rotation.y = t * 0.4;
    waves.current.children.forEach((w, i) => {
      const k = (t * 0.5 + i / 3) % 1;
      w.scale.setScalar(0.5 + k * 3);
      w.material.opacity = (1 - k) * 0.7;
    });
  });
  const legs = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  const H = 9;
  return (
    <>
      <group position={[I.x, I.y, I.z]}>
        {legs.map(([x, z], i) => (
          <mesh key={i} position={[x * 0.6, H / 2, z * 0.6]} rotation={[z * 0.08, 0, -x * 0.08]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, H, 6]} />
            <meshStandardMaterial color="#d9dee8" metalness={0.6} roughness={0.35} />
          </mesh>
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i} position={[0, 1 + i * 1.2, 0]} rotation={[0, (i % 2) * 0.785, 0]}>
            <torusGeometry args={[0.95 - i * 0.07, 0.035, 4, 4]} />
            <meshStandardMaterial color="#ff5d5d" metalness={0.3} />
          </mesh>
        ))}
        <group ref={dish} position={[0, H - 1.6, 0]}>
          <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2.6]}>
            <sphereGeometry args={[0.8, 20, 10, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#f2f4f8" side={THREE.DoubleSide} metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
        <mesh ref={beacon} position={[0, H + 0.2, 0]}>
          <sphereGeometry args={[0.22, 16, 12]} />
          <meshBasicMaterial color="#ff3b3b" toneMapped={false} />
        </mesh>
        <group ref={waves} position={[0, H + 0.2, 0]}>
          {[0, 1, 2].map(i => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1, 0.03, 6, 40]} />
              <meshBasicMaterial color={glow('#7db8ff', 2)} transparent toneMapped={false} depthWrite={false} />
            </mesh>
          ))}
        </group>
        <RigidBody type="fixed" colliders={false}>
          <Blocker shape={CylinderCollider} args={[H / 2, 0.85]} position={[0, H / 2, 0]} />
        </RigidBody>
      </group>
      <group position={[it.x, it.y, it.z]} rotation={[0, Math.atan2(I.x - it.x, I.z - it.z) + Math.PI, 0]}>
        <PhoneBooth />
      </group>
    </>
  );
}

// ---------------------------------------------------------------------
// Trophy Summit (awards)
// ---------------------------------------------------------------------
const cupGeo = (() => {
  const pts = [
    [0, 0],
    [0.32, 0],
    [0.32, 0.06],
    [0.1, 0.12],
    [0.07, 0.4],
    [0.12, 0.48],
    [0.38, 0.62],
    [0.42, 0.95],
    [0.38, 0.95],
    [0.34, 0.66],
    [0, 0.6],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(pts, 24);
})();

const MEDAL = { 1: '#ffd166', 2: '#d9e1ee', 3: '#e09a5b' };

function Summit() {
  const I = islandById.awards;
  const cups = useRef();
  const flag = useRef();
  const flagMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `uniform float uTime; varying vec2 vUv; void main(){ vUv = uv; vec3 p = position; p.z += sin(p.x * 3.0 - uTime * 5.0) * 0.12 * uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`,
        fragmentShader: `varying vec2 vUv; void main(){ vec3 a = vec3(1.0,0.54,0.32); vec3 b = vec3(1.0,0.82,0.4); gl_FragColor = vec4(mix(a,b,step(0.5, fract(vUv.y*3.0))), 1.0); }`,
      }),
    []
  );
  useFrame(({ clock }, dt) => {
    flagMat.uniforms.uTime.value += dt;
    cups.current.children.forEach((c, i) => {
      c.rotation.y = clock.elapsedTime * 0.6 + i;
    });
  });
  const tiers = [
    { place: 2, x: -1.5, h: 1.0 },
    { place: 1, x: 0, h: 1.5 },
    { place: 3, x: 1.5, h: 0.7 },
  ];
  const counts = AWARDS.reduce((m, a) => ({ ...m, [a.place]: (m[a.place] || 0) + 1 }), {});
  return (
    <group position={[I.x, I.y, I.z]}>
      {tiers.map(t => (
        <group key={t.place} position={[t.x, 0, 0]}>
          <mesh position={[0, t.h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.45, t.h, 1.45]} />
            <meshStandardMaterial color="#f4efe6" roughness={0.5} />
          </mesh>
          <Text font={FONT_DISPLAY} fontSize={0.45} color={MEDAL[t.place]} position={[0, t.h / 2, 0.735]} anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#3b2a1e">
            {String(t.place)}
          </Text>
        </group>
      ))}
      <group ref={cups}>
        {tiers.map(t => (
          <group key={t.place} position={[t.x, t.h, 0]} scale={t.place === 1 ? 1.7 : 1.3}>
            <mesh geometry={cupGeo} castShadow>
              <meshStandardMaterial color={MEDAL[t.place]} metalness={0.95} roughness={0.18} emissive={MEDAL[t.place]} emissiveIntensity={0.25} />
            </mesh>
            {counts[t.place] > 1 && (
              <Billboard position={[0, 1.3, 0]}>
                <Text font={FONT_BOLD} fontSize={0.22} color="#ffffff" outlineWidth={0.015} outlineColor="#3b2a1e">
                  {`×${counts[t.place]}`}
                </Text>
              </Billboard>
            )}
          </group>
        ))}
      </group>
      {/* flag */}
      <group position={[-3.6, 0, -2.4]}>
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 5, 8]} />
          <meshStandardMaterial color="#d9dee8" metalness={0.6} />
        </mesh>
        <mesh ref={flag} position={[0.8, 4.4, 0]} material={flagMat}>
          <planeGeometry args={[1.6, 1, 16, 4]} />
        </mesh>
      </group>
      <RigidBody type="fixed" colliders={false}>
        {tiers.map(t => (
          <CuboidCollider key={t.place} args={[0.72, t.h / 2, 0.72]} position={[t.x, t.h / 2, 0]} />
        ))}
        <CylinderCollider args={[2.5, 0.08]} position={[-3.6, 2.5, -2.4]} />
      </RigidBody>
    </group>
  );
}

export default function Landmarks() {
  return (
    <>
      <ZoneTitles />
      <Clickable id="about">
        <Shrine />
      </Clickable>
      <Clickable id="monk">
        <MonkBot />
      </Clickable>
      {CRYSTALS.map(c => (
        <Clickable key={c.id} id={`skill-${c.id}`}>
          <Crystal c={c} />
        </Clickable>
      ))}
      {MONOLITHS.map(m => (
        <Clickable key={m.id} id={`exp-${m.id}`}>
          <Monolith m={m} />
        </Clickable>
      ))}
      {CABINETS.map(c => (
        <Clickable key={c.id} id={`proj-${c.id}`}>
          <Cabinet c={c} />
        </Clickable>
      ))}
      <Clickable id="research">
        <Observatory />
      </Clickable>
      {LANDMARKS.map(l => (
        <Clickable key={l.id} id={`edu-${l.id}`}>
          {l.id === 'usm' ? <USMTower l={l} /> : <CornellTower l={l} />}
        </Clickable>
      ))}
      <Clickable id="contact">
        <SignalTower />
      </Clickable>
      <Clickable id="awards">
        <Summit />
      </Clickable>
    </>
  );
}
