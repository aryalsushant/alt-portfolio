import React from 'react';
import SceneBox, { LevelGate } from './SceneBox';
import { PROJECTS } from '../content';

function Storefront({ x, p }) {
  return (
    <SceneBox x={x} w={25} y={78 - 60} h={60} className="ip-building">
      <div className="ip-building-roof" style={{ background: 'linear-gradient(180deg, #14434d, #0c2b33)' }} />
      <div className="ip-building-body" style={{ background: 'linear-gradient(180deg, #17333c, #0f2129)' }}>
        <div className="ip-neon" style={{ '--glow': p.glow, fontSize: 'clamp(15px, 1.5vw, 22px)' }}>{p.name}</div>
        <div className="ip-eyebrow" style={{ letterSpacing: '.14em', color: 'var(--ip-pink)' }}>{p.tagline}</div>
        <p style={{ margin: 0, color: 'var(--ip-text-dim)', fontSize: 'clamp(11px, 0.95vw, 13.5px)', lineHeight: 1.55 }}>
          {p.desc}
        </p>
        <div>
          {p.stack.map(s => <span key={s} className="ip-chip">{s}</span>)}
        </div>
        {(p.github || p.demo) && (
          <div style={{ display: 'flex', gap: '0.7vw', marginTop: 'auto' }}>
            {p.github && (
              <a className="ip-btn" href={p.github} target="_blank" rel="noopener noreferrer">GITHUB ↗</a>
            )}
            {p.demo && (
              <a className="ip-btn" href={p.demo} target="_blank" rel="noopener noreferrer">DEMO ↗</a>
            )}
          </div>
        )}
      </div>
    </SceneBox>
  );
}

export default function Level5Projects() {
  return (
    <>
      <LevelGate x={1192} label="LEVEL 5 · PROJECTS" />
      {PROJECTS.map((p, i) => (
        <Storefront key={p.name} x={1222 + i * 56} p={p} />
      ))}
    </>
  );
}
