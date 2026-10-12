import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame, setState, runtime } from '../core/store';
import { ZONES, BRIDGES, STONES, ISLANDS } from '../core/layout';
import { warpTo } from './actions';
import { sfx } from '../audio/sound';

// Full-screen world map with fast travel. SVG in world units (x right, z down).
const PAD = 14;
const minX = Math.min(...ISLANDS.map(i => i.x - i.r)) - PAD;
const maxX = Math.max(...ISLANDS.map(i => i.x + i.r)) + PAD;
const minZ = Math.min(...ISLANDS.map(i => i.z - i.r)) - PAD;
const maxZ = Math.max(...ISLANDS.map(i => i.z + i.r)) + PAD;

function PlayerMarker() {
  const ref = useRef(null);
  useEffect(() => {
    let raf;
    const tick = () => {
      const P = runtime.player;
      if (ref.current) {
        ref.current.setAttribute('transform', `translate(${P.x} ${P.z}) rotate(${180 - (P.yaw * 180) / Math.PI})`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <g ref={ref}>
      <circle r="3.4" fill="rgba(255,138,82,0.25)">
        <animate attributeName="r" values="2.6;4.6;2.6" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <path d="M0 -3 L2.2 2.2 L0 1.1 L-2.2 2.2 Z" fill="#ff8a52" stroke="#fff" strokeWidth="0.6" />
    </g>
  );
}

export default function MapScreen() {
  const discovered = useGame(s => s.discovered);
  const zone = useGame(s => s.zone);

  return (
    <motion.div
      className="gx-map"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setState({ mapOpen: false })}
    >
      <motion.div
        className="gx-map-card"
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 10 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onClick={e => e.stopPropagation()}
      >
        <header>
          <div>
            <span className="gx-panel-eyebrow">World map</span>
            <h2>The Archipelago</h2>
          </div>
          <p>Tap an island to fast travel.</p>
          <button className="gx-close" onClick={() => setState({ mapOpen: false })} aria-label="Close map">
            ✕
          </button>
        </header>
        <svg viewBox={`${minX} ${minZ} ${maxX - minX} ${maxZ - minZ}`} className="gx-map-svg">
          <defs>
            <radialGradient id="mapIsland" cx="40%" cy="35%">
              <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {BRIDGES.map(b => (
            <line key={b.id} x1={b.from.x} y1={b.from.z} x2={b.to.x} y2={b.to.z} stroke="#e8c8a0" strokeWidth="2.2" strokeDasharray="1.2 0.6" strokeLinecap="round" />
          ))}
          {STONES.map(s => (
            <circle key={s.id} cx={s.x} cy={s.z} r={s.r} fill="#c8e37a" opacity="0.9" />
          ))}
          {ZONES.map(z => {
            const found = discovered.includes(z.id);
            const here = zone === z.id;
            return (
              <g
                key={z.id}
                className={`gx-map-zone ${here ? 'is-here' : ''}`}
                onClick={() => {
                  if (here) return;
                  sfx.click();
                  warpTo(z.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Fast travel to ${z.name}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !here) warpTo(z.id);
                }}
              >
                <circle cx={z.x} cy={z.z} r={z.r} fill={z.grass} stroke={here ? '#fff' : 'rgba(255,255,255,0.4)'} strokeWidth={here ? 0.9 : 0.4} />
                <circle cx={z.x} cy={z.z} r={z.r} fill="url(#mapIsland)" />
                <text x={z.x} y={z.z - 1} textAnchor="middle" className="gx-map-icon">
                  {z.icon}
                </text>
                <text x={z.x} y={z.z + 4.2} textAnchor="middle" className="gx-map-label">
                  {z.name}
                </text>
                {!found && (
                  <text x={z.x} y={z.z + 7.6} textAnchor="middle" className="gx-map-new">
                    UNDISCOVERED
                  </text>
                )}
              </g>
            );
          })}
          <PlayerMarker />
        </svg>
      </motion.div>
    </motion.div>
  );
}
