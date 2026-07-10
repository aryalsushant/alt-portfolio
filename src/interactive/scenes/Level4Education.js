import React from 'react';
import SceneBox, { LevelGate } from './SceneBox';
import { EDUCATION } from '../content';

function Hall({ x, ed }) {
  return (
    <SceneBox x={x} w={28} y={78 - 46} h={46} className="ip-building">
      {/* double temple-style roof */}
      <div className="ip-building-roof" style={{ width: '124%', background: 'linear-gradient(180deg, #55346a, #3a2450)' }} />
      <div className="ip-building-roof" style={{ width: '108%', marginTop: '0.6vh', background: 'linear-gradient(180deg, #55346a, #3a2450)' }} />
      <div className="ip-building-body" style={{ background: 'linear-gradient(180deg, #33284e, #241b3b)' }}>
        <div className="ip-neon" style={{ '--glow': '#c9a0ff' }}>{ed.school}</div>
        <div style={{ fontWeight: 700, fontSize: 'clamp(14px, 1.2vw, 18px)' }}>{ed.degree}</div>
        <div style={{ color: 'var(--ip-text-dim)', fontSize: 'clamp(12px, 1vw, 14px)' }}>{ed.sub}</div>
        <div className="ip-eyebrow" style={{ letterSpacing: '.14em' }}>{ed.dates}</div>
        <p style={{ margin: 0, color: 'var(--ip-text-dim)', fontSize: 'clamp(11px, 0.95vw, 13.5px)', lineHeight: 1.55 }}>
          {ed.detail}
        </p>
      </div>
    </SceneBox>
  );
}

export default function Level4Education() {
  return (
    <>
      <LevelGate x={1022} label="LEVEL 4 · EDUCATION" />
      <Hall x={1054} ed={EDUCATION[0]} />
      <Hall x={1140} ed={EDUCATION[1]} />
    </>
  );
}
