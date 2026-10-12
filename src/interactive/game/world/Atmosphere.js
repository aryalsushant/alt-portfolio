import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime } from '../core/store';

// Golden-hour palette shared by sky, fog and cloud sea so everything melts
// into one horizon.
export const PALETTE = {
  zenith: new THREE.Color('#2b2a6b'),
  mid: new THREE.Color('#8a5cb3'),
  horizon: new THREE.Color('#ffb38a'),
  sun: new THREE.Color('#fff1c9'),
  fog: new THREE.Color('#e9a3a0'),
  cloudTop: new THREE.Color('#ffd9c2'),
  cloudShadow: new THREE.Color('#9a6fb4'),
};

export const SUN_DIR = new THREE.Vector3(-0.55, 0.32, -0.77).normalize();

const skyVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * p;
    gl_Position.z = gl_Position.w; // pin to the far plane
  }
`;

const skyFrag = /* glsl */ `
  uniform vec3 uZenith; uniform vec3 uMid; uniform vec3 uHorizon; uniform vec3 uSun;
  uniform vec3 uSunDir; uniform float uTime;
  varying vec3 vDir;

  float hash(vec3 p) { p = fract(p * 0.3183099 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }

  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.28, h));
    col = mix(col, uZenith, smoothstep(0.22, 0.85, h));
    // below the horizon fade into the cloud sea tint
    col = mix(col, uHorizon * 0.92, smoothstep(0.0, -0.25, h));

    float s = max(dot(d, normalize(uSunDir)), 0.0);
    col += uSun * pow(s, 900.0) * 6.0;            // disc
    col += uSun * pow(s, 60.0) * 0.55;            // corona
    col += vec3(1.0, 0.55, 0.35) * pow(s, 6.0) * 0.35; // warm wash

    // stars, fading in toward the zenith away from the sun
    vec3 g = floor(d * 220.0);
    float st = step(0.9965, hash(g));
    float tw = 0.6 + 0.4 * sin(uTime * 2.0 + hash(g + 3.0) * 40.0);
    col += st * tw * smoothstep(0.35, 0.8, h) * (1.0 - pow(s, 2.0)) * 0.9;

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function Sky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVert,
        fragmentShader: skyFrag,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uZenith: { value: PALETTE.zenith },
          uMid: { value: PALETTE.mid },
          uHorizon: { value: PALETTE.horizon },
          uSun: { value: PALETTE.sun },
          uSunDir: { value: SUN_DIR },
          uTime: { value: 0 },
        },
      }),
    []
  );
  const ref = useRef();
  useFrame(({ camera }, dt) => {
    mat.uniforms.uTime.value += dt;
    ref.current.position.copy(camera.position);
  });
  return (
    <mesh ref={ref} material={mat} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[400, 48, 24]} />
    </mesh>
  );
}

const cloudVert = /* glsl */ `
  varying vec2 vUv; varying vec3 vWorld;
  #include <fog_pars_vertex>
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const cloudFrag = /* glsl */ `
  uniform float uTime; uniform vec3 uTop; uniform vec3 uShadow; uniform vec3 uHorizon; uniform vec3 uSunDir;
  varying vec2 vUv; varying vec3 vWorld;
  #include <fog_pars_fragment>

  vec2 hash2(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return -1.0 + 2.0 * fract(sin(p) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash2(i), f), dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
               mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)), dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; } return v; }

  void main() {
    vec2 p = vWorld.xz * 0.018;
    float t = uTime * 0.012;
    float n = fbm(p + vec2(t, t * 0.6));
    float n2 = fbm(p * 2.2 - vec2(t * 1.7, 0.0) + n);
    float c = smoothstep(-0.25, 0.55, n + n2 * 0.5);
    // fake lighting: offset sample toward the sun gives a lit rim
    float nl = fbm(p + uSunDir.xz * 0.06 + vec2(t, t * 0.6));
    float lit = clamp((n - nl) * 4.0 + 0.6, 0.0, 1.0);
    vec3 col = mix(uShadow, uTop, c * 0.7 + lit * 0.3);
    col = mix(col, uHorizon, 0.15);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

export function CloudSea() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: cloudVert,
        fragmentShader: cloudFrag,
        fog: true,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          {
            uTime: { value: 0 },
            uTop: { value: PALETTE.cloudTop },
            uShadow: { value: PALETTE.cloudShadow },
            uHorizon: { value: PALETTE.horizon },
            uSunDir: { value: SUN_DIR },
          },
        ]),
      }),
    []
  );
  const ref = useRef();
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    // follow the player in xz so the sea is endless
    ref.current.position.x = Math.round(runtime.player.x / 50) * 50;
    ref.current.position.z = Math.round(runtime.player.z / 50) * 50;
  });
  return (
    <mesh ref={ref} material={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, -26, 0]}>
      <planeGeometry args={[900, 900, 1, 1]} />
    </mesh>
  );
}

// Puffy low-poly cloud clusters drifting between the islands.
export function CloudPuffs({ count = 18 }) {
  const group = useRef();
  const puffs = useMemo(() => {
    const rnd = (a, b) => a + Math.random() * (b - a);
    return Array.from({ length: count }, (_, i) => ({
      x: rnd(-120, 140),
      y: rnd(-14, 26),
      z: rnd(-200, 60),
      s: rnd(2.5, 6),
      speed: rnd(0.3, 0.9),
      blobs: Array.from({ length: 5 }, () => [rnd(-1.6, 1.6), rnd(-0.3, 0.6), rnd(-0.8, 0.8), rnd(0.6, 1.2)]),
      key: i,
    }));
  }, [count]);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fff0f0',
        emissive: '#ffb3a1',
        emissiveIntensity: 0.25,
        roughness: 1,
        flatShading: true,
      }),
    []
  );
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  useFrame((_, dt) => {
    group.current.children.forEach((c, i) => {
      c.position.x += puffs[i].speed * dt;
      if (c.position.x > 160) c.position.x = -140;
    });
  });
  return (
    <group ref={group}>
      {puffs.map(p => (
        <group key={p.key} position={[p.x, p.y, p.z]} scale={p.s}>
          {p.blobs.map((b, j) => (
            <mesh key={j} geometry={geo} material={mat} position={[b[0], b[1], b[2]]} scale={[b[3], b[3] * 0.7, b[3]]} />
          ))}
        </group>
      ))}
    </group>
  );
}

// Sun + sky fill. The shadow frustum follows the player so a tight box
// keeps shadows crisp anywhere in the world.
export function Lighting({ shadows, shadowSize = 2048 }) {
  const sun = useRef();
  const { scene } = useThree();
  const target = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    scene.add(target);
    return () => scene.remove(target);
  }, [scene, target]);
  useFrame(() => {
    const p = runtime.player;
    const L = sun.current;
    if (!L) return;
    // snap to texel-ish grid to avoid shadow shimmering while moving
    const snap = 0.5;
    const x = Math.round(p.x / snap) * snap;
    const z = Math.round(p.z / snap) * snap;
    L.position.set(x + SUN_DIR.x * 60, p.y + SUN_DIR.y * 60 + 10, z + SUN_DIR.z * 60);
    target.position.set(x, p.y, z);
    L.target = target;
  });
  return (
    <>
      <hemisphereLight args={['#c9b8ff', '#6b4a3a', 0.9]} />
      <ambientLight intensity={0.18} color="#ffd2b8" />
      <directionalLight
        ref={sun}
        color="#ffe2b8"
        intensity={2.6}
        castShadow={shadows}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      {/* cool rim light from the opposite side for silhouettes */}
      <directionalLight color="#8fa8ff" intensity={0.55} position={[40, 20, 60]} />
    </>
  );
}
