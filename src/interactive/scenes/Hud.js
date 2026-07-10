import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFrame } from '../engine/useScrollDriver';
import { levelFor, TOTAL_VH } from '../engine/timeline';

export default function Hud({ onSkip }) {
  const badgeRef = useRef(null);
  const progRef = useRef(null);
  const lastLevel = useRef(-1);

  useFrame(s => {
    const lv = levelFor(s.yVh);
    if (lv.n !== lastLevel.current && badgeRef.current) {
      lastLevel.current = lv.n;
      badgeRef.current.innerHTML =
        lv.n === 0 || lv.n === 7
          ? `<b>${lv.label}</b>`
          : `LEVEL <b>${lv.n}</b> · ${lv.label}`;
    }
    if (progRef.current) {
      progRef.current.style.setProperty('--prog', Math.min(1, s.yVh / TOTAL_VH).toFixed(4));
    }
  });

  return (
    <>
      <div ref={progRef} className="ip-hud-progress" />
      <div className="ip-hud">
        <span ref={badgeRef} className="ip-hud-badge"><b>START</b></span>
        <span style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="ip-hud-link"
            style={{ cursor: 'pointer' }}
            onClick={onSkip}
          >
            SKIP ANIMATION
          </button>
          <Link className="ip-hud-link" to="/">EXIT ↗</Link>
        </span>
      </div>
    </>
  );
}
