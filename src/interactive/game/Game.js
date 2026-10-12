import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import Player, { createCharacterState } from './player/Player';
import FollowCamera from './player/FollowCamera';
import { Sky, CloudSea, CloudPuffs, Lighting, PALETTE } from './world/Atmosphere';
import Terrain from './world/Terrain';
import Foliage from './world/Foliage';
import Spawn from './world/Spawn';
import Landmarks from './world/Landmarks';
import { JumpPads, Shards, ZoneTracker } from './world/Gameplay';
import Particles, { Fireflies } from './fx/Particles';
import Effects from './fx/Effects';
import { attachMouse, pollGamepad } from './input/input';
import { getState, setState, useGame, runtime } from './core/store';
import { emit } from './core/events';
import { TIERS, TIER_SETTINGS } from './core/quality';
import { SPAWN } from './core/layout';

function Ready() {
  useEffect(() => {
    if (getState().phase === 'loading') setState({ phase: 'title' });
  }, []);
  return null;
}

// Drop the robot out of the sky when the player presses start.
function IntroDirector({ character }) {
  const phase = useGame(s => s.phase);
  useEffect(() => {
    if (phase !== 'intro') return undefined;
    runtime.teleport = { x: SPAWN.x, y: SPAWN.y + 18, z: SPAWN.z, yaw: SPAWN.yaw };
    character.frozen = true;
    const t = setTimeout(() => {
      character.frozen = false;
      setState({ phase: 'playing' });
    }, 2300);
    return () => clearTimeout(t);
  }, [phase, character]);
  return null;
}

const gamepadAction = action => emit('uiAction', action);

function InputBridge() {
  const { gl } = useThree();
  useEffect(() => attachMouse(gl.domElement), [gl]);
  useFrame((_, dt) => pollGamepad(dt, gamepadAction));
  return null;
}

function World({ tier, character }) {
  const s = TIER_SETTINGS[tier];
  return (
    <>
      <Sky />
      <CloudSea />
      <CloudPuffs count={s.clouds} />
      <Lighting shadows={s.shadows} shadowSize={s.shadowSize} />
      <Terrain />
      <Foliage tier={tier} />
      <Spawn />
      <Landmarks />
      <JumpPads />
      <Shards />
      <ZoneTracker />
      <Fireflies count={s.fireflies} />
      <Particles tier={tier} character={character} />
    </>
  );
}

export default function Game() {
  const tier = useGame(s => s.tier);
  const quality = useGame(s => s.quality);
  const paused = useGame(s => s.paused || s.mapOpen);
  const settings = TIER_SETTINGS[tier];
  const character = useMemo(() => createCharacterState(), []);
  const declines = useRef(0);

  const step = dir => {
    if (getState().quality !== 'auto') return;
    const i = TIERS.indexOf(getState().tier);
    const next = TIERS[Math.max(0, Math.min(TIERS.length - 1, i + dir))];
    if (next !== getState().tier) {
      setState({ tier: next });
      emit('tierChanged', { tier: next });
    }
  };

  return (
    <Canvas
      className="gx-canvas"
      shadows={settings.shadows ? 'soft' : false}
      dpr={settings.dpr}
      gl={{
        antialias: tier === 'low',
        powerPreference: 'high-performance',
        stencil: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ fov: 52, near: 0.1, far: 900, position: [30, 14, 20] }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(PALETTE.horizon);
        if (process.env.NODE_ENV !== 'production' && window.__gx) window.__gx.scene = scene;
      }}
    >
      <fog attach="fog" args={[PALETTE.fog, 75, 300]} />
      {quality === 'auto' && (
        <PerformanceMonitor
          flipflops={4}
          bounds={refresh => (refresh > 90 ? [55, 100] : [44, 58])}
          onDecline={() => {
            declines.current += 1;
            step(-1);
          }}
          onIncline={() => {
            if (declines.current < 2) step(1);
          }}
        />
      )}
      <InputBridge />
      <Suspense fallback={null}>
        <Physics timeStep={1 / 60} updatePriority={-50} gravity={[0, -22, 0]} paused={paused}>
          <World tier={tier} character={character} />
          <Player character={character} />
          <FollowCamera character={character} />
          <IntroDirector character={character} />
          <Ready />
        </Physics>
        <Effects tier={tier} />
      </Suspense>
    </Canvas>
  );
}
