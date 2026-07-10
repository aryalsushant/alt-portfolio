import React from 'react';
import SceneBox from './SceneBox';
import { SKILLS } from '../content';
import { RIVER_Y } from '../sprites/Terrain';

const rnd = i => {
  const x = Math.sin(i * 91.3 + 17.2) * 24634.63;
  return x - Math.floor(x);
};

// One cluster of uniform floating lanterns — same size for every skill,
// deliberately no proficiency ordering.
function LanternCluster({ x0, group }) {
  const cols = 4;
  return (
    <>
      {/* stilt sign with the group name, standing in the river */}
      <SceneBox x={x0 + 6} w={20} y={170} className="ip-skill-header">
        <div className="ip-ribbon">{group.group}</div>
        <div className="ip-skill-post" style={{ height: `${RIVER_Y - 176}vh` }} />
      </SceneBox>

      {SKILLS && group.items.map((skill, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = x0 + col * 17 + rnd(i + x0) * 4;
        const y = 183 + row * 14 + rnd(i * 3 + x0) * 3;
        return (
          <SceneBox key={skill} x={x} w={14} y={y}>
            <div
              className={`ip-lantern ip-lantern--${group.tone}`}
              style={{ position: 'relative', animationDelay: `${rnd(i + 9) * 3.5}s` }}
            >
              <div className="ip-lantern-body">{skill}</div>
            </div>
          </SceneBox>
        );
      })}
    </>
  );
}

export default function Level2Skills() {
  return (
    <>
      {/* countdown banner strung from the bridge cables at the jump point */}
      <SceneBox x={450} w={13} y={50} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '64%', height: '8vh' }}>
          <div className="ip-banner-rope" />
          <div className="ip-banner-rope" />
        </div>
        <div className="ip-bungee-banner">1, 2, 3 BUNJEE!</div>
      </SceneBox>

      {/* gate floats on stilts at the gorge edge */}
      <SceneBox x={444} w={16} y={168} className="ip-gate" style={{ alignItems: 'center' }}>
        <div className="ip-gate-sign">LEVEL 2 · SKILLS</div>
        <div className="ip-gate-posts" style={{ height: `${RIVER_Y - 174}vh` }}>
          <div className="ip-gate-post" />
          <div className="ip-gate-post" />
        </div>
      </SceneBox>

      <LanternCluster x0={468} group={SKILLS[0]} />
      <LanternCluster x0={560} group={SKILLS[1]} />
      <LanternCluster x0={648} group={SKILLS[2]} />
    </>
  );
}
