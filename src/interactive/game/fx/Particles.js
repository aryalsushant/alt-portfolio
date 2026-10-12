import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { on } from '../core/events';
import { ISLANDS } from '../core/layout';

// Pooled CPU-simulated particles rendered as soft point sprites.
// Two pools: additive (sparks, glow) and alpha (dust, confetti).

const vert = /* glsl */ `
  attribute float aSize; attribute float aAlpha; attribute vec3 aColor;
  varying float vAlpha; varying vec3 vColor;
  uniform float uScale;
  void main() {
    vAlpha = aAlpha; vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / max(0.1, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const frag = /* glsl */ `
  varying float vAlpha; varying vec3 vColor;
  uniform float uSquare;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    float a = mix(smoothstep(0.5, 0.0, d), step(max(abs(p.x), abs(p.y)), 0.38), uSquare);
    if (a * vAlpha < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

class Pool {
  constructor(n, additive, square = false) {
    this.n = n;
    this.i = 0;
    this.pos = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.col = new Float32Array(n * 3);
    this.size = new Float32Array(n);
    this.size0 = new Float32Array(n);
    this.alpha = new Float32Array(n);
    this.life = new Float32Array(n);
    this.life0 = new Float32Array(n);
    this.grav = new Float32Array(n);
    this.drag = new Float32Array(n);
    this.grow = new Float32Array(n);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.geo.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3));
    this.geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    this.geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1));
    this.mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
      uniforms: { uScale: { value: 300 }, uSquare: { value: square ? 1 : 0 } },
    });
    this.points = new THREE.Points(this.geo, this.mat);
    this.points.frustumCulled = false;
  }

  spawn(x, y, z, vx, vy, vz, color, size, life, grav = 0, drag = 0, grow = 0) {
    const i = this.i;
    this.i = (this.i + 1) % this.n;
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx;
    this.vel[i * 3 + 1] = vy;
    this.vel[i * 3 + 2] = vz;
    this.col[i * 3] = color.r;
    this.col[i * 3 + 1] = color.g;
    this.col[i * 3 + 2] = color.b;
    this.size0[i] = size;
    this.life[i] = life;
    this.life0[i] = life;
    this.grav[i] = grav;
    this.drag[i] = drag;
    this.grow[i] = grow;
  }

  update(dt) {
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) {
        this.alpha[i] = 0;
        continue;
      }
      this.life[i] -= dt;
      const k = Math.max(0, this.life[i] / this.life0[i]);
      const d = Math.exp(-this.drag[i] * dt);
      this.vel[i * 3] *= d;
      this.vel[i * 3 + 1] = this.vel[i * 3 + 1] * d - this.grav[i] * dt;
      this.vel[i * 3 + 2] *= d;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      this.alpha[i] = Math.min(1, k * 2.2);
      this.size[i] = this.size0[i] * (1 + this.grow[i] * (1 - k));
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.aColor.needsUpdate = true;
    this.geo.attributes.aSize.needsUpdate = true;
    this.geo.attributes.aAlpha.needsUpdate = true;
  }
}

const DUST = new THREE.Color('#fff1dc');
const SPARK = new THREE.Color('#7ff3ff').multiplyScalar(2);
const THRUST = new THREE.Color('#8ff6ff').multiplyScalar(1.8);
const CONFETTI = ['#ff7ac8', '#ffd166', '#63e7de', '#9d8cff', '#ff8a52', '#7ccf6a'].map(c => new THREE.Color(c));
const rnd = (a, b) => a + Math.random() * (b - a);

export default function Particles({ tier, character }) {
  const { size, gl } = useThree();
  const mult = tier === 'low' ? 0.4 : tier === 'medium' ? 0.7 : 1;
  const pools = useMemo(() => ({ add: new Pool(700, true), dust: new Pool(400, false), conf: new Pool(500, false, true) }), []);
  const stepT = useRef(0);
  const dashT = useRef(0);

  useEffect(() => {
    const n = c => Math.max(1, Math.round(c * mult));
    const { add, dust, conf } = pools;
    const offs = [
      on('land', ({ pos, impact }) => {
        for (let i = 0; i < n(8 + impact * 20); i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = rnd(1.5, 3.5) * (0.6 + impact);
          dust.spawn(pos.x, pos.y - 0.75, pos.z, Math.cos(a) * sp, rnd(0.3, 1.2), Math.sin(a) * sp, DUST, rnd(0.25, 0.5), rnd(0.35, 0.7), -0.5, 4, 1.8);
        }
      }),
      on('jump', ({ pos }) => {
        for (let i = 0; i < n(8); i++) {
          const a = Math.random() * Math.PI * 2;
          dust.spawn(pos.x, pos.y - 0.75, pos.z, Math.cos(a) * 2, rnd(0.2, 0.8), Math.sin(a) * 2, DUST, rnd(0.2, 0.4), rnd(0.3, 0.5), 0, 4, 1.4);
        }
      }),
      on('doubleJump', ({ pos }) => {
        for (let i = 0; i < n(26); i++) {
          const a = (i / 26) * Math.PI * 2;
          add.spawn(pos.x, pos.y - 0.7, pos.z, Math.cos(a) * 4.5, rnd(-1.5, -0.5), Math.sin(a) * 4.5, THRUST, rnd(0.18, 0.3), rnd(0.3, 0.5), 0, 5, 0);
        }
      }),
      on('pad', ({ pos, pad }) => {
        const c = new THREE.Color(pad.color).multiplyScalar(2);
        for (let i = 0; i < n(40); i++) {
          const a = Math.random() * Math.PI * 2;
          const r = rnd(0.3, 1.3);
          add.spawn(pos.x + Math.cos(a) * r, pos.y - 0.6, pos.z + Math.sin(a) * r, Math.cos(a) * 0.6, rnd(6, 14), Math.sin(a) * 0.6, c, rnd(0.15, 0.3), rnd(0.5, 1), 9, 1.5, 0);
        }
      }),
      on('dash', ({ pos }) => {
        dashT.current = 0.17;
        for (let i = 0; i < n(12); i++) {
          const a = Math.random() * Math.PI * 2;
          dust.spawn(pos.x, pos.y - 0.7, pos.z, Math.cos(a) * 3, rnd(0.2, 1), Math.sin(a) * 3, DUST, rnd(0.3, 0.5), rnd(0.3, 0.6), 0, 4, 1.6);
        }
      }),
      on('collect', ({ pos }) => {
        for (let i = 0; i < n(36); i++) {
          const th = Math.random() * Math.PI * 2;
          const ph = Math.acos(rnd(-1, 1));
          const sp = rnd(2, 6);
          add.spawn(pos.x, pos.y, pos.z, Math.sin(ph) * Math.cos(th) * sp, Math.cos(ph) * sp + 2, Math.sin(ph) * Math.sin(th) * sp, SPARK, rnd(0.12, 0.26), rnd(0.4, 0.9), 6, 2.5, 0);
        }
      }),
      on('achievement', () => {
        const p = character.render;
        for (let i = 0; i < n(90); i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = rnd(2, 6);
          conf.spawn(p.x, p.y + 1.5, p.z, Math.cos(a) * sp, rnd(5, 10), Math.sin(a) * sp, CONFETTI[i % CONFETTI.length], rnd(0.05, 0.1), rnd(1.6, 2.6), 9, 1.8, 0);
        }
      }),
      on('discover', () => {
        const p = character.render;
        for (let i = 0; i < n(50); i++) {
          const a = (i / 50) * Math.PI * 2;
          add.spawn(p.x + Math.cos(a) * 1.5, p.y - 0.6, p.z + Math.sin(a) * 1.5, Math.cos(a) * 0.5, rnd(2, 5), Math.sin(a) * 0.5, new THREE.Color('#ffd166').multiplyScalar(2), rnd(0.15, 0.3), rnd(0.8, 1.4), 0, 1, 0);
        }
      }),
      on('respawn', () => {
        const p = character.render;
        for (let i = 0; i < n(30); i++) {
          add.spawn(p.x, p.y, p.z, rnd(-3, 3), rnd(-1, 3), rnd(-3, 3), THRUST, rnd(0.2, 0.35), rnd(0.4, 0.8), 0, 3, 0);
        }
      }),
    ];
    return () => offs.forEach(f => f());
  }, [pools, mult, character]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const scale = (size.height * gl.getPixelRatio()) / 2;
    Object.values(pools).forEach(p => {
      p.mat.uniforms.uScale.value = scale;
    });

    // footstep dust while running
    const ch = character;
    if (ch.grounded && ch.moving > 0.6) {
      stepT.current -= dt;
      if (stepT.current <= 0) {
        stepT.current = 0.09 / mult;
        pools.dust.spawn(ch.render.x + rnd(-0.2, 0.2), ch.render.y - 0.78, ch.render.z + rnd(-0.2, 0.2), -ch.vel.x * 0.08, rnd(0.3, 0.8), -ch.vel.z * 0.08, DUST, rnd(0.15, 0.3), rnd(0.25, 0.45), 0, 3, 1.5);
      }
    }
    // dash trail
    if (ch.dashT > 0) {
      for (let i = 0; i < 3; i++) {
        pools.add.spawn(ch.render.x + rnd(-0.25, 0.25), ch.render.y + rnd(-0.4, 0.5), ch.render.z + rnd(-0.25, 0.25), 0, 0, 0, THRUST, rnd(0.25, 0.4), rnd(0.25, 0.4), 0, 0, -0.6);
      }
    }
    pools.add.update(dt);
    pools.dust.update(dt);
    pools.conf.update(dt);
  });

  return (
    <>
      <primitive object={pools.dust.points} />
      <primitive object={pools.add.points} />
      <primitive object={pools.conf.points} />
    </>
  );
}

// Ambient fireflies / pollen drifting over every island. GPU-animated.
const ffVert = /* glsl */ `
  uniform float uTime; uniform float uScale;
  attribute float aSeed;
  varying float vA;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.4 + aSeed * 6.0) * 0.8;
    p.y += sin(uTime * 0.7 + aSeed * 11.0) * 0.5;
    p.z += cos(uTime * 0.35 + aSeed * 9.0) * 0.8;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vA = 0.5 + 0.5 * sin(uTime * 2.0 + aSeed * 30.0);
    gl_PointSize = (0.12 + aSeed * 0.08) * uScale / max(0.1, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const ffFrag = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vA;
    gl_FragColor = vec4(vec3(1.0, 0.85, 0.45) * 2.2, a);
  }
`;

export function Fireflies({ count = 260 }) {
  const { size, gl } = useThree();
  const { geo, mat } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const I = ISLANDS[i % ISLANDS.length];
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * (I.r + 3);
      pos[i * 3] = I.x + Math.cos(a) * r;
      pos[i * 3 + 1] = I.y + 0.5 + Math.random() * 4;
      pos[i * 3 + 2] = I.z + Math.sin(a) * r;
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: ffVert,
      fragmentShader: ffFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      uniforms: { uTime: { value: 0 }, uScale: { value: 300 } },
    });
    return { geo: g, mat: m };
  }, [count]);
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    mat.uniforms.uScale.value = (size.height * gl.getPixelRatio()) / 2;
  });
  return <points geometry={geo} material={mat} frustumCulled={false} />;
}
