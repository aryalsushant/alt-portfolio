import React, { useEffect, useMemo, useRef } from 'react';
import './interactive.css';
import { createScrollDriver, ScrollContext, useFrame } from './engine/useScrollDriver';
import useReducedMotion from './engine/useReducedMotion';
import { NAV_STOPS, TOTAL_VH, cameraAt, nightAt } from './engine/timeline';
import { Sky, MountainsFar, Skyline } from './sprites/Backdrop';
import Terrain from './sprites/Terrain';
import Obstacles from './sprites/Obstacles';
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

const KEY_DIRECTIONS = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
};

const easeInOutCubic = t => (
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
);

const isEditableTarget = target => {
  if (!target) return false;
  const tag = target.tagName;
  return target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
};

const scrollYToVh = () => {
  const vh100 = window.innerHeight / 100;
  return vh100 ? (window.scrollY || 0) / vh100 : 0;
};

const STOP_EPSILON_VH = 6;

const nextStopIndex = (yVh, direction) => {
  if (direction > 0) {
    const next = NAV_STOPS.findIndex(stop => stop.yVh > yVh + STOP_EPSILON_VH);
    return next === -1 ? NAV_STOPS.length - 1 : next;
  }

  for (let index = NAV_STOPS.length - 1; index >= 0; index -= 1) {
    if (NAV_STOPS[index].yVh < yVh - STOP_EPSILON_VH) return index;
  }

  return 0;
};

const keyJumpDuration = distanceVh => Math.min(2600, Math.max(900, distanceVh * 9.5));

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

function Ride() {
  const driver = useMemo(() => createScrollDriver(), []);
  const stageRef = useRef(null);
  const layerRefs = useRef([]);
  const keyScrollRef = useRef({ raf: 0, active: false });

  useEffect(() => {
    driver.start();
    return () => driver.stop();
  }, [driver]);

  // Arrow keys snap to the next portfolio stop with one controlled movement.
  useEffect(() => {
    const keyScroll = keyScrollRef.current;

    const cancelKeyScroll = () => {
      if (!keyScroll.active) return;
      cancelAnimationFrame(keyScroll.raf);
      keyScroll.active = false;
    };

    const animateToStop = targetYVh => {
      const vh100 = window.innerHeight / 100;
      const startY = window.scrollY || 0;
      const targetY = Math.max(0, targetYVh * vh100);
      const distance = Math.abs(targetY - startY);

      if (distance < 2) return;

      const duration = keyJumpDuration(Math.abs(targetYVh - scrollYToVh()));
      const startTime = performance.now();
      keyScroll.active = true;

      const step = now => {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = easeInOutCubic(progress);

        window.scrollTo(0, startY + (targetY - startY) * eased);

        if (progress < 1) {
          keyScroll.raf = requestAnimationFrame(step);
          return;
        }

        window.scrollTo(0, targetY);
        keyScroll.active = false;
      };

      keyScroll.raf = requestAnimationFrame(step);
    };

    const onKey = e => {
      const dir = KEY_DIRECTIONS[e.key];
      if (!dir) return;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();

      if (e.repeat || keyScroll.active) return;

      const currentYVh = scrollYToVh();
      const targetIndex = nextStopIndex(currentYVh, dir);

      animateToStop(NAV_STOPS[targetIndex].yVh);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', cancelKeyScroll, { passive: true });
    window.addEventListener('touchstart', cancelKeyScroll, { passive: true });

    return () => {
      cancelKeyScroll();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', cancelKeyScroll);
      window.removeEventListener('touchstart', cancelKeyScroll);
    };
  }, []);

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
              <Obstacles />
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
          <Hud />
        </div>

        <CameraRig layerRefs={layerRefs} stageRef={stageRef} />
      </div>
    </ScrollContext.Provider>
  );
}

export default function InteractivePortfolio() {
  const reduced = useReducedMotion();

  if (reduced) return <StaticFallback />;
  return <Ride />;
}
