import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, setState, setPersisted, runtime } from '../core/store';
import { ZONES, BRIDGES, SHARDS, STONES, ISLANDS } from '../core/layout';
import { ACHIEVEMENTS } from '../core/achievements';
import { sfx } from '../audio/sound';

// North-up minimap drawn on a canvas every frame from the shared runtime.
function Minimap({ size }) {
  const ref = useRef(null);
  const collected = useGame(s => s.shards);
  const collectedRef = useRef(collected);
  collectedRef.current = collected;

  useEffect(() => {
    const cv = ref.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = size * dpr;
    cv.height = size * dpr;
    const g = cv.getContext('2d');
    let raf;
    const scale = (size / 70) * dpr; // ~70m across
    const draw = () => {
      const P = runtime.player;
      const W = cv.width;
      g.clearRect(0, 0, W, W);
      g.save();
      g.beginPath();
      g.arc(W / 2, W / 2, W / 2 - 1, 0, Math.PI * 2);
      g.clip();
      g.fillStyle = 'rgba(28, 18, 52, 0.72)';
      g.fillRect(0, 0, W, W);
      const tx = x => W / 2 + (x - P.x) * scale;
      const tz = z => W / 2 + (z - P.z) * scale;
      // bridges
      g.strokeStyle = 'rgba(232, 200, 160, 0.9)';
      g.lineWidth = 2.2 * scale;
      g.lineCap = 'round';
      BRIDGES.forEach(b => {
        g.beginPath();
        g.moveTo(tx(b.from.x), tz(b.from.z));
        g.lineTo(tx(b.to.x), tz(b.to.z));
        g.stroke();
      });
      // islands
      ISLANDS.forEach(I => {
        g.beginPath();
        g.arc(tx(I.x), tz(I.z), I.r * scale, 0, Math.PI * 2);
        g.fillStyle = I.grass;
        g.globalAlpha = 0.85;
        g.fill();
        g.globalAlpha = 1;
      });
      STONES.forEach(s => {
        g.beginPath();
        g.arc(tx(s.x), tz(s.z), s.r * scale, 0, Math.PI * 2);
        g.fillStyle = '#c8e37a';
        g.fill();
      });
      // shards
      g.fillStyle = '#7ff3ff';
      SHARDS.forEach(s => {
        if (collectedRef.current.includes(s.id)) return;
        g.beginPath();
        g.arc(tx(s.x), tz(s.z), 1.6 * dpr, 0, Math.PI * 2);
        g.fill();
      });
      // zone icons
      g.font = `${10 * dpr}px "Space Grotesk", sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      ZONES.forEach(z => {
        if (z.id === 'spawn') return;
        g.fillStyle = '#ffffff';
        g.fillText(z.icon, tx(z.x), tz(z.z));
      });
      g.restore();
      // camera view cone
      const cy = runtime.camera.yaw;
      g.save();
      g.translate(W / 2, W / 2);
      g.rotate(-cy);
      g.beginPath();
      g.moveTo(0, 0);
      g.arc(0, 0, W * 0.3, -Math.PI / 2 - 0.45, -Math.PI / 2 + 0.45);
      g.closePath();
      g.fillStyle = 'rgba(255,255,255,0.12)';
      g.fill();
      g.restore();
      // player arrow
      g.save();
      g.translate(W / 2, W / 2);
      g.rotate(Math.PI - P.yaw);
      g.beginPath();
      g.moveTo(0, -7 * dpr);
      g.lineTo(5 * dpr, 5 * dpr);
      g.lineTo(0, 2.5 * dpr);
      g.lineTo(-5 * dpr, 5 * dpr);
      g.closePath();
      g.fillStyle = '#ff8a52';
      g.strokeStyle = '#ffffff';
      g.lineWidth = 1.5 * dpr;
      g.fill();
      g.stroke();
      g.restore();
      // ring
      g.beginPath();
      g.arc(W / 2, W / 2, W / 2 - 1.5 * dpr, 0, Math.PI * 2);
      g.strokeStyle = 'rgba(255,255,255,0.55)';
      g.lineWidth = 2 * dpr;
      g.stroke();
      g.fillStyle = '#ffffff';
      g.font = `700 ${9 * dpr}px "Space Grotesk", sans-serif`;
      g.fillText('N', W / 2, 9 * dpr);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <button
      className="gx-minimap"
      style={{ width: size, height: size }}
      onClick={() => {
        sfx.click();
        setState({ mapOpen: true });
      }}
      aria-label="Open world map"
    >
      <canvas ref={ref} style={{ width: size, height: size }} />
    </button>
  );
}

function ZoneBanner() {
  const zone = useGame(s => s.zone);
  const Z = ZONES.find(z => z.id === zone);
  return (
    <div className="gx-zone">
      <AnimatePresence mode="wait">
        <motion.div
          key={zone || 'void'}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.25 }}
        >
          <span className="gx-zone-icon" style={{ color: Z?.color || '#fff' }}>{Z ? Z.icon : '☁'}</span>
          <span>{Z ? Z.name : 'In the skies'}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Hud({ onAction }) {
  const shards = useGame(s => s.shards.length);
  const discovered = useGame(s => s.discovered.length);
  const achievements = useGame(s => s.achievements.length);
  const muted = useGame(s => s.muted);
  const touch = useGame(s => s.touch);
  const lastShards = useRef(shards);
  const bump = shards !== lastShards.current;
  lastShards.current = shards;

  return (
    <div className="gx-hud">
      <div className="gx-hud-left">
        <Minimap size={touch ? 96 : 136} />
        <div className="gx-hud-stats">
          <ZoneBanner />
          <div className="gx-counters">
            <motion.span key={shards} className="gx-counter" initial={bump ? { scale: 1.35 } : false} animate={{ scale: 1 }}>
              <i className="gx-shard-icon" /> {shards}<small>/{SHARDS.length}</small>
            </motion.span>
            <span className="gx-counter">
              🗺 {discovered}<small>/{ZONES.length}</small>
            </span>
            <span className="gx-counter">
              🏅 {achievements}<small>/{ACHIEVEMENTS.length}</small>
            </span>
          </div>
        </div>
      </div>
      <div className="gx-hud-right">
        <button className="gx-icon-btn" onClick={() => onAction('map')} aria-label="Map" title="Map (M)">
          🗺
        </button>
        <button
          className="gx-icon-btn"
          onClick={() => setPersisted({ muted: !muted })}
          aria-label={muted ? 'Unmute' : 'Mute'}
          title="Sound (N)"
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button className="gx-icon-btn" onClick={() => onAction('pause')} aria-label="Menu" title="Menu (Esc)">
          ☰
        </button>
      </div>
    </div>
  );
}
