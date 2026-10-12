import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGame } from '../core/store';
import { SHARDS, ZONES } from '../core/layout';

const STAGES = ['Booting physics engine', 'Raising islands', 'Calibrating robot', 'Tuning the sunset'];

export default function TitleScreen({ onStart }) {
  const phase = useGame(s => s.phase);
  const touch = useGame(s => s.touch);
  const shards = useGame(s => s.shards.length);
  const discovered = useGame(s => s.discovered.length);
  const [progress, setProgress] = useState(0);
  const ready = phase === 'title';

  // Real readiness is binary (physics WASM + fonts resolve together), so the
  // bar eases toward 90% while loading and completes on ready.
  useEffect(() => {
    if (ready) {
      setProgress(100);
      return undefined;
    }
    const id = setInterval(() => setProgress(p => p + (90 - p) * 0.06), 60);
    return () => clearInterval(id);
  }, [ready]);

  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor((progress / 92) * STAGES.length))];
  const returning = shards > 0 || discovered > 1;

  return (
    <motion.div
      className="gx-title"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      onClick={ready ? onStart : undefined}
    >
      <div className="gx-title-inner">
        <motion.p className="gx-eyebrow" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          An interactive portfolio
        </motion.p>
        <motion.h1 className="gx-logo" initial={{ y: 30, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 90, damping: 14 }}>
          <span>SUSHANT</span>
          <span className="gx-logo-2">ARYAL</span>
        </motion.h1>
        <motion.p className="gx-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          Explore {ZONES.length} floating islands · {SHARDS.length} data shards · one very determined robot
        </motion.p>

        <div className="gx-start-area">
          {!ready ? (
            <div className="gx-loader">
              <div className="gx-loader-bar">
                <div style={{ width: `${progress}%` }} />
              </div>
              <p>{stage}…</p>
            </div>
          ) : (
            <motion.button
              className="gx-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={e => {
                e.stopPropagation();
                onStart();
              }}
              autoFocus
            >
              <span className="gx-start-pulse" />
              {touch ? 'TAP TO START' : 'PRESS ANY KEY TO START'}
            </motion.button>
          )}
          {ready && returning && (
            <p className="gx-continue">
              Welcome back — {discovered}/{ZONES.length} islands found, {shards}/{SHARDS.length} shards collected
            </p>
          )}
        </div>
      </div>

      <div className="gx-title-foot" onClick={e => e.stopPropagation()}>
        <Link to="/classic" className="gx-link">Skip to classic portfolio →</Link>
        <span className="gx-dot">·</span>
        <Link to="/" className="gx-link">Exit</Link>
        <span className="gx-dot">·</span>
        <span className="gx-hint-sound">🔊 Sound on for the full experience</span>
      </div>
    </motion.div>
  );
}
