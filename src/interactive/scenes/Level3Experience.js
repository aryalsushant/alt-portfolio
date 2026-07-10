import React from 'react';
import SceneBox, { LevelGate } from './SceneBox';
import { EXPERIENCE } from '../content';

const GLOWS = ['#63e7de', '#ff7ac8', '#ffb454', '#8ecbff'];

function Building({ x, job, glow }) {
  return (
    <SceneBox x={x} w={24} y={78 - 58} h={58} className="ip-building">
      <div className="ip-building-roof" />
      <div className="ip-building-body">
        <div className="ip-neon" style={{ '--glow': glow }}>{job.company}</div>
        <div style={{ fontWeight: 700, fontSize: 'clamp(13px, 1.15vw, 17px)', color: 'var(--ip-text)' }}>
          {job.title}
        </div>
        <div className="ip-eyebrow" style={{ letterSpacing: '.14em' }}>{job.dates}</div>
        <ul style={{ margin: 0, paddingLeft: '1.1em', color: 'var(--ip-text-dim)', fontSize: 'clamp(11px, 0.92vw, 13.5px)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '0.7vh' }}>
          {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>
    </SceneBox>
  );
}

export default function Level3Experience() {
  return (
    <>
      <LevelGate x={762} label="LEVEL 3 · EXPERIENCE" />
      {EXPERIENCE.map((job, i) => (
        <Building key={job.company} x={790 + i * 54} job={job} glow={GLOWS[i % GLOWS.length]} />
      ))}
    </>
  );
}
