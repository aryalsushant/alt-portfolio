import React, { useEffect, useMemo, useRef, useState } from 'react';
import './interactive.css';
import { createScrollDriver, ScrollContext, useFrame } from './engine/useScrollDriver';
import useReducedMotion from './engine/useReducedMotion';
import { TOTAL_VH, cameraAt, nightAt } from './engine/timeline';
import { Sky, MountainsFar, Skyline } from './sprites/Backdrop';
import Terrain from './sprites/Terrain';
import Robot from './sprites/Robot';
import Plane from './sprites/Plane';
import Splash from './scenes/Splash';
import Level1About from './scenes/Level1About';
import Level2Skills from './scenes/Level2Skills';
import Level3Experience from './scenes/Level3Experience';
import Level4Education from './scenes/Level4Education';
import Level5Projects from './scenes/Level5Projects';
import Level6Awards from './scenes/Level6Awards';
import ContactSummit from './scenes/ContactSummit';
import Hud from './scenes/Hud';
import StaticFallback from './scenes/StaticFallback';

// Parallax: [xFactor, yFactor] per layer — far ridge, city, main world.
const LAYERS = [
  [0.22, 0.06],
  [0.5, 0.14],
  [1, 1],
];

function CameraRig({ layerRefs, stageRef }) {
  useFrame(s => {
    const { camX, camY } = cameraAt(s.smoothYVh);
    const px = (camX * s.vw) / 100;
    const py = (camY * s.vh) / 100;
    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      const [fx, fy] = LAYERS[i];
      el.style.transform = `translate3d(${(-px * fx).toFixed(1)}px, ${(-py * fy).toFixed(1)}px, 0)`;
    });
    if (stageRef.current) {
      stageRef.current.style.setProperty('--night', nightAt(s.smoothYVh).toFixed(3));
    }
  });
  return null;
}

function Ride({ onSkip }) {
  const driver = useMemo(() => createScrollDriver(), []);
  const stageRef = useRef(null);
  const layerRefs = useRef([]);

  useEffect(() => {
    driver.start();
    return () => driver.stop();
  }, [driver]);

  // scale the whole world down on narrow screens; pacing stays in vh
  useEffect(() => {
    const setScale = () => {
      const k = Math.min(1, Math.max(0.62, window.innerWidth / 1280));
      stageRef.current?.style.setProperty('--ip-scale', k.toFixed(3));
    };
    setScale();
    window.addEventListener('resize', setScale, { passive: true });
    return () => window.removeEventListener('resize', setScale);
  }, []);

  return (
    <ScrollContext.Provider value={driver}>
      <div className="ip-root">
        {/* invisible spacer — scrollY is the master clock */}
        <div style={{ height: `${TOTAL_VH + 100}vh` }} aria-hidden="true" />

        <div className="ip-stage" ref={stageRef}>
          <Sky />
          <div className="ip-scale">
            <div className="ip-layer ip-layer--deco" ref={el => { layerRefs.current[0] = el; }}>
              <MountainsFar />
            </div>
            <div className="ip-layer ip-layer--deco" ref={el => { layerRefs.current[1] = el; }}>
              <Skyline />
              <div className="ip-haze" />
            </div>
            <div className="ip-layer" ref={el => { layerRefs.current[2] = el; }}>
              <Terrain />
              <Splash />
              <Level1About />
              <Level2Skills />
              <Level3Experience />
              <Level4Education />
              <Level5Projects />
              <Level6Awards />
              <ContactSummit />
            </div>
            <Robot />
            <Plane />
          </div>
          <Hud onSkip={onSkip} />
        </div>

        <CameraRig layerRefs={layerRefs} stageRef={stageRef} />
      </div>
    </ScrollContext.Provider>
  );
}

export default function InteractivePortfolio() {
  const reduced = useReducedMotion();
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (skip) window.scrollTo(0, 0);
  }, [skip]);

  if (reduced || skip) return <StaticFallback />;
  return <Ride onSkip={() => setSkip(true)} />;
}
