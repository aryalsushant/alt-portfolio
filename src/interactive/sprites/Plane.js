import React, { useRef } from 'react';
import { useFrame } from '../engine/useScrollDriver';
import { SEG, seg } from '../engine/timeline';
import { mapRange, easeOutCubic, easeInCubic } from '../engine/math';

// Little rescue plane that hooks the bungee cord and carries the robot
// back up to ground level. Screen-space, visible only around its segment.
export default function Plane() {
  const ref = useRef(null);

  useFrame(s => {
    const el = ref.current;
    if (!el) return;
    const y = s.smoothYVh;
    const active = y > SEG.plane[0] - 30 && y < SEG.plane[1] + 20;
    if (!active) {
      el.style.setProperty('--pvis', 0);
      return;
    }
    const t = seg('plane', y);
    // robot's ry during the plane segment (mirror of Robot.js)
    const robotRy = t < 0.55
      ? mapRange(t, 0, 0.55, 30, 10, easeOutCubic)
      : mapRange(t, 0.55, 1, 10, 64, easeInCubic);

    let px;
    if (t < 0.18) px = mapRange(t, 0, 0.18, 118, 40, easeOutCubic); // swoop in
    else if (t < 0.9) px = 40;                                      // carry
    else px = mapRange(t, 0.9, 1, 40, -35, easeInCubic);            // fly off

    const py = robotRy - 12.5;
    el.style.setProperty('--px', px.toFixed(2));
    el.style.setProperty('--py', py.toFixed(2));
    el.style.setProperty('--pvis', t <= 0 ? 0 : 1);
  });

  return (
    <div ref={ref} className="ip-plane">
      <svg viewBox="0 0 160 80">
        {/* propeller */}
        <rect id="prop" x="2" y="18" width="6" height="44" rx="3" fill="#d8dbe6" />
        {/* fuselage */}
        <path d="M8 40 Q30 18 92 24 L138 30 Q156 34 152 44 Q148 54 128 54 L34 56 Q14 54 8 40 Z"
          fill="#e34a33" stroke="#8a2f1d" strokeWidth="2.5" />
        {/* cockpit */}
        <path d="M62 24 Q70 10 88 12 L92 24 Z" fill="#63e7de" stroke="#2a6b66" strokeWidth="2" />
        {/* wing */}
        <rect x="58" y="36" width="52" height="10" rx="5" fill="#ffb454" stroke="#a86a1e" strokeWidth="2" />
        {/* tail */}
        <path d="M128 32 L150 14 L154 30 Z" fill="#ffb454" stroke="#a86a1e" strokeWidth="2" />
        {/* hook for the cord */}
        <path d="M78 56 L78 70 Q78 76 84 76" stroke="#d8dbe6" strokeWidth="3.5" fill="none" />
      </svg>
    </div>
  );
}
