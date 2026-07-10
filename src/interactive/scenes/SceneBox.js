import React, { useRef } from 'react';
import { useFrame } from '../engine/useScrollDriver';
import { cameraAt } from '../engine/timeline';

// Absolutely-positioned world region with cheap visibility culling:
// hidden whenever it sits more than ~1.7 viewports from the camera.
export default function SceneBox({ x, w, y = 0, h, z, className = '', style, children }) {
  const ref = useRef(null);
  const vis = useRef(true);

  useFrame(s => {
    const el = ref.current;
    if (!el) return;
    const { camX } = cameraAt(s.smoothYVh);
    const v = x + w > camX - 70 && x < camX + 170;
    if (v !== vis.current) {
      vis.current = v;
      el.style.visibility = v ? '' : 'hidden';
    }
  });

  return (
    <div
      ref={ref}
      className={`ip-scene ${className}`}
      style={{
        left: `${x}vw`,
        top: `${y}vh`,
        width: `${w}vw`,
        ...(h ? { height: `${h}vh` } : {}),
        ...(z !== undefined ? { zIndex: z } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Red level-gate sign on two posts, rleonardi-style.
export function LevelGate({ x, label, y = 78, postH = 16 }) {
  return (
    <SceneBox x={x} w={16} y={y - postH - 6} className="ip-gate" style={{ alignItems: 'center' }}>
      <div className="ip-gate-sign">{label}</div>
      <div className="ip-gate-posts" style={{ height: `${postH}vh` }}>
        <div className="ip-gate-post" />
        <div className="ip-gate-post" />
      </div>
    </SceneBox>
  );
}
