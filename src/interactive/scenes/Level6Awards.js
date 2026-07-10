import React, { useRef } from 'react';
import SceneBox, { LevelGate } from './SceneBox';
import { useFrame } from '../engine/useScrollDriver';
import { seg } from '../engine/timeline';
import { invLerp, easeOutBack } from '../engine/math';
import { AWARDS } from '../content';
import { slopePoint } from '../sprites/Terrain';

const FLAG_US = [0.16, 0.4, 0.64, 0.88]; // positions along the slope
// climb runs worst → best: the biggest win waits at the top
const CLIMB_ORDER = [...AWARDS].reverse();

export default function Level6Awards() {
  const refs = useRef([]);

  useFrame(s => {
    const t = seg('climb', s.smoothYVh);
    FLAG_US.forEach((u, i) => {
      const el = refs.current[i];
      if (!el) return;
      const pop = easeOutBack(invLerp(u - 0.14, u - 0.02, t));
      el.style.setProperty('--pop', Math.max(0, pop).toFixed(3));
    });
  });

  return (
    <>
      <LevelGate x={1372} label="LEVEL 6 · AWARDS" />
      {CLIMB_ORDER.map((a, i) => {
        const pt = slopePoint(FLAG_US[i]);
        return (
          <SceneBox key={a.event} x={pt.x} w={26} y={pt.y - 14} z={5}>
            <div className="ip-flag" ref={el => { refs.current[i] = el; }}>
              <div className="ip-flag-pole" style={{ height: '14vh' }} />
              <div className="ip-flag-banner">
                <div style={{ fontSize: 'clamp(15px, 1.4vw, 21px)' }}>
                  {a.medal} <b style={{ fontSize: 'clamp(12px, 1.05vw, 15px)' }}>{a.title}</b>
                </div>
                <div style={{ color: 'var(--ip-text-dim)', fontSize: 'clamp(11px, 0.9vw, 13px)', marginTop: '0.4vh' }}>
                  {a.event}
                </div>
              </div>
            </div>
          </SceneBox>
        );
      })}
    </>
  );
}
