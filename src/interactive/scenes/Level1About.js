import React from 'react';
import SceneBox, { LevelGate } from './SceneBox';
import { ABOUT } from '../content';

// A leafy sign sprouting from the ground with a themed tag on it.
function PlantTag({ x, label, delay = 0 }) {
  return (
    <SceneBox x={x} w={16} y={49} h={29} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 60 46" style={{ width: '5vw', minWidth: 44, marginBottom: '-1.2vh', animation: `ip-bob 5s ease-in-out ${delay}s infinite` }}>
        <path d="M30 44 Q8 34 12 12 Q30 20 30 44" fill="#4caf6d" />
        <path d="M30 44 Q52 34 48 12 Q30 20 30 44" fill="#2e7d4f" />
        <path d="M30 44 Q30 16 30 6" stroke="#2e7d4f" strokeWidth="3" fill="none" />
        <circle cx="30" cy="6" r="4" fill="#ff7ac8" />
      </svg>
      <div className="ip-card" style={{ padding: '1.2vh 1vw', textAlign: 'center', fontSize: 'clamp(11px, 0.95vw, 14px)', fontWeight: 700 }}>
        {label}
      </div>
      {/* post stretches to the grass line so the sign never floats */}
      <div className="ip-skill-post" style={{ flex: 1 }} />
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
      <SceneBox x={320} w={22} y={40} h={38} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {/* meditating monk robot, levitating over the banner */}
        <svg viewBox="0 0 100 92" style={{ width: '4.8vw', minWidth: 48, marginBottom: '0.4vh', animation: 'ip-bob 6s ease-in-out infinite' }}>
          {/* halo */}
          <ellipse cx="50" cy="12" rx="15" ry="3.6" fill="none" stroke="#ffd166" strokeWidth="2.4" opacity=".85" />
          {/* crossed legs */}
          <path d="M16 80 Q30 66 50 66 Q70 66 84 80 Q66 90 50 90 Q34 90 16 80 Z" fill="#8f99b4" />
          <path d="M30 78 Q40 72 50 72 Q60 72 70 78" stroke="#4b5470" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* arms resting on knees */}
          <rect x="18" y="52" width="10" height="24" rx="5" fill="#aab4cc" transform="rotate(20 23 64)" />
          <rect x="72" y="52" width="10" height="24" rx="5" fill="#aab4cc" transform="rotate(-20 77 64)" />
          {/* body */}
          <rect x="32" y="42" width="36" height="34" rx="11" fill="#ff9d6b" />
          <circle cx="50" cy="58" r="5" fill="#ffd166" />
          {/* head */}
          <rect x="30" y="16" width="40" height="28" rx="12" fill="#e8ecf7" />
          <rect x="35" y="22" width="30" height="16" rx="8" fill="#1c2138" />
          {/* zen eyes */}
          <path d="M40 30 Q43 33 46 30 M54 30 Q57 33 60 30" stroke="#63e7de" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* antenna */}
          <line x1="50" y1="16" x2="50" y2="8" stroke="#8f99b4" strokeWidth="2.5" />
          <circle cx="50" cy="6" r="3.6" fill="#ffd166" />
          {/* drifting calm sparkles */}
          <circle cx="20" cy="34" r="2" fill="#ff7ac8" opacity=".7" />
          <circle cx="82" cy="28" r="2" fill="#63e7de" opacity=".7" />
        </svg>
        <div className="ip-ribbon" style={{ animation: 'ip-bob 4s ease-in-out infinite' }}>😴 {ABOUT.ribbon}</div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: '.14em', color: 'var(--ip-text-dim)', marginTop: '1vh' }}>
          stress levels: unmeasurable
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '86%', flex: 1 }}>
          <div className="ip-skill-post" />
          <div className="ip-skill-post" />
        </div>
      </SceneBox>
    </>
  );
}
