import React from 'react';
import SceneBox, { LevelGate } from './SceneBox';
import { ABOUT } from '../content';

// A leafy sign sprouting from the ground with a themed tag on it.
function PlantTag({ x, label, delay = 0 }) {
  return (
    <SceneBox x={x} w={16} y={49} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 60 46" style={{ width: '5vw', minWidth: 44, marginBottom: '-1.2vh', animation: `ip-bob 5s ease-in-out ${delay}s infinite` }}>
        <path d="M30 44 Q8 34 12 12 Q30 20 30 44" fill="#4caf6d" />
        <path d="M30 44 Q52 34 48 12 Q30 20 30 44" fill="#2e7d4f" />
        <path d="M30 44 Q30 16 30 6" stroke="#2e7d4f" strokeWidth="3" fill="none" />
        <circle cx="30" cy="6" r="4" fill="#ff7ac8" />
      </svg>
      <div className="ip-card" style={{ padding: '1.2vh 1vw', textAlign: 'center', fontSize: 'clamp(11px, 0.95vw, 14px)', fontWeight: 700 }}>
        {label}
      </div>
      <div className="ip-skill-post" style={{ height: '9vh' }} />
    </SceneBox>
  );
}

export default function Level1About() {
  return (
    <>
      <LevelGate x={132} label="LEVEL 1 · ABOUT" />

      {/* headline card */}
      <SceneBox x={158} w={38} y={18}>
        <p className="ip-eyebrow" style={{ marginBottom: '1.4vh' }}>Player Profile</p>
        <div className="ip-card" style={{ padding: '3vh 2vw' }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(20px, 2vw, 30px)', fontWeight: 800, lineHeight: 1.15 }}>
            {ABOUT.title}
          </h2>
          <p style={{ color: 'var(--ip-text-dim)', fontSize: 'clamp(13px, 1.1vw, 16px)', lineHeight: 1.6, marginBottom: 0 }}>
            {ABOUT.blurb}
          </p>
        </div>
      </SceneBox>

      {/* themed plant tags — no proficiency scales, just what he does */}
      <PlantTag x={215} label={ABOUT.tags[0]} />
      <PlantTag x={245} label={ABOUT.tags[1]} delay={0.8} />
      <PlantTag x={275} label={ABOUT.tags[2]} delay={1.6} />

      {/* the meme ribbon */}
      <SceneBox x={320} w={22} y={50} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div className="ip-ribbon" style={{ animation: 'ip-bob 4s ease-in-out infinite' }}>😴 {ABOUT.ribbon}</div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: '.14em', color: 'var(--ip-text-dim)', marginTop: '1vh' }}>
          stress levels: unmeasurable
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '86%', height: '18vh' }}>
          <div className="ip-skill-post" />
          <div className="ip-skill-post" />
        </div>
      </SceneBox>
    </>
  );
}
