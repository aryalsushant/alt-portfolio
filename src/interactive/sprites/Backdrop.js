import React, { useMemo, useRef } from 'react';
import { useFrame } from '../engine/useScrollDriver';
import { cameraAt } from '../engine/timeline';
import { clamp } from '../engine/math';

// Deterministic pseudo-random so renders are stable.
const rnd = i => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function Sky() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        left: rnd(i) * 100,
        top: rnd(i + 500) * 62,
        delay: rnd(i + 900) * 3.2,
        size: 1.5 + rnd(i + 1300) * 2.2,
      })),
    []
  );
  return (
    <div className="ip-sky">
      <div className="ip-sky-day" />
      <div className="ip-sky-night" />
      <div className="ip-stars">
        {stars.map((st, i) => (
          <span
            key={i}
            className="ip-star"
            style={{
              left: `${st.left}vw`,
              top: `${st.top}vh`,
              width: st.size,
              height: st.size,
              animationDelay: `${st.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="ip-sun" />
      <div className="ip-moon" />
    </div>
  );
}

// Far mountain ridge — parallax factor ~0.22, spans the whole ride.
export function MountainsFar() {
  const points = useMemo(() => {
    let d = 'M0,400 L0,240 ';
    for (let x = 0; x <= 5200; x += 130) {
      const h = 90 + rnd(x) * 190;
      d += `L${x + 65},${400 - h} L${x + 130},${400 - (60 + rnd(x + 7) * 110)} `;
    }
    d += 'L5200,400 Z';
    return d;
  }, []);
  return (
    <svg
      className="ip-mountains-far"
      style={{
        position: 'absolute', bottom: '16vh', left: 0,
        width: '520vw', height: '42vh',
        filter: 'brightness(calc(1 - var(--night) * 0.55))',
      }}
      viewBox="0 0 5200 400"
      preserveAspectRatio="none"
    >
      <path d={points} fill="#5a6a95" opacity="0.85" />
      <path d={points} fill="#46557e" opacity="0.7" transform="translate(60, 40) scale(1, 0.92)" />
    </svg>
  );
}

// A tiered temple/pagoda silhouette.
function Pagoda({ x, s = 1, fill }) {
  return (
    <g transform={`translate(${x}, 0) scale(${s})`} fill={fill}>
      <rect x="52" y="-8" width="6" height="16" />
      <path d="M10 60 Q55 30 100 60 L88 60 L88 66 L22 66 L22 60 Z" />
      <path d="M20 108 Q55 82 90 108 L82 108 L82 114 L28 114 L28 108 Z" />
      <path d="M0 160 Q55 128 110 160 L100 160 L100 200 L10 200 L10 160 Z" />
      <rect x="30" y="66" width="50" height="42" />
      <rect x="38" y="114" width="34" height="46" />
    </g>
  );
}

// City skyline + temples — parallax factor ~0.5. Window lights key off --night.
// Fades out as the camera dives into the gorge (its layer barely moves with
// camY, so over the river the buildings would look like they float on nothing).
export function Skyline() {
  const ref = useRef(null);
  const lastO = useRef('');

  useFrame(s => {
    const el = ref.current;
    if (!el) return;
    const { camY } = cameraAt(s.smoothYVh);
    const o = clamp(1 - camY / 60, 0, 1).toFixed(3);
    if (o !== lastO.current) {
      lastO.current = o;
      el.style.opacity = o;
      el.style.visibility = o === '0.000' ? 'hidden' : '';
    }
  });

  const buildings = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => {
        const w = 60 + rnd(i + 20) * 90;
        const h = 120 + rnd(i + 60) * 260;
        const x = i * 145 + rnd(i + 99) * 40;
        const windows = [];
        const cols = Math.max(2, Math.floor(w / 26));
        const rows = Math.max(3, Math.floor(h / 42));
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            if (rnd(i * 31 + c * 7 + r * 13) > 0.45) {
              windows.push([10 + c * (w - 20) / cols, 14 + r * (h - 24) / rows]);
            }
          }
        }
        return { x, w, h, windows, roof: rnd(i + 200) > 0.72 };
      }),
    []
  );
  return (
    <svg
      ref={ref}
      className="ip-skyline"
      style={{
        position: 'absolute', bottom: '20vh', left: 0,
        width: '940vw', height: '46vh',
        filter: 'brightness(calc(1 - var(--night) * 0.45))',
      }}
      viewBox="0 0 9400 460"
      preserveAspectRatio="none"
    >
      {buildings.map((b, i) => (
        <g key={i} transform={`translate(${b.x}, ${460 - b.h})`}>
          {b.roof && <path d={`M-8 0 Q${b.w / 2} -34 ${b.w + 8} 0 Z`} fill="#222945" />}
          <rect width={b.w} height={b.h} fill={i % 3 ? '#2b3354' : '#242b49'} />
          {b.windows.map(([wx, wy], j) => (
            <rect key={j} className="ip-window" x={wx} y={wy} width="11" height="14" rx="2" />
          ))}
        </g>
      ))}
      {[520, 2350, 4300, 6100, 8200].map((x, i) => (
        <Pagoda key={i} x={x} s={1 + rnd(i + 40) * 0.35} fill="#1d2340" />
      ))}
    </svg>
  );
}
