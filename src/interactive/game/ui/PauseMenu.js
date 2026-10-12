import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGame, setState, setPersisted, resetProgress } from '../core/store';
import { ACHIEVEMENTS } from '../core/achievements';
import { SHARDS, ZONES } from '../core/layout';
import { emit } from '../core/events';
import { openPanel } from './actions';
import { sfx } from '../audio/sound';

const QUALITY = [
  ['auto', 'Auto'],
  ['low', 'Low'],
  ['medium', 'Medium'],
  ['high', 'High'],
];

export default function PauseMenu() {
  const muted = useGame(s => s.muted);
  const quality = useGame(s => s.quality);
  const tier = useGame(s => s.tier);
  const got = useGame(s => s.achievements);
  const shards = useGame(s => s.shards.length);
  const discovered = useGame(s => s.discovered.length);
  const [confirmReset, setConfirmReset] = useState(false);

  const resume = () => {
    sfx.click();
    setState({ paused: false });
  };

  return (
    <motion.div className="gx-pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="gx-pause-card"
        initial={{ y: 24, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 12, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      >
        <div className="gx-pause-main">
          <span className="gx-panel-eyebrow">Paused</span>
          <h2>Menu</h2>
          <button className="gx-menu-btn gx-menu-btn--primary" onClick={resume} autoFocus>
            ▶ Resume
          </button>
          <button
            className="gx-menu-btn"
            onClick={() => {
              setState({ paused: false, mapOpen: true });
              sfx.click();
            }}
          >
            🗺 World map & fast travel
          </button>
          <button
            className="gx-menu-btn"
            onClick={() => {
              setState({ paused: false });
              openPanel({ type: 'howto' });
            }}
          >
            🎮 Controls
          </button>
          <Link className="gx-menu-btn" to="/classic">
            📄 Classic portfolio
          </Link>
          <Link className="gx-menu-btn" to="/">
            ⏏ Exit to home
          </Link>

          <div className="gx-settings">
            <div className="gx-setting">
              <span>Sound</span>
              <button className={`gx-toggle ${muted ? '' : 'is-on'}`} onClick={() => setPersisted({ muted: !muted })} aria-pressed={!muted}>
                <i />
              </button>
            </div>
            <div className="gx-setting">
              <span>
                Graphics <small>({tier})</small>
              </span>
              <div className="gx-seg">
                {QUALITY.map(([k, label]) => (
                  <button
                    key={k}
                    className={quality === k ? 'is-on' : ''}
                    onClick={() => {
                      sfx.click();
                      setPersisted({ quality: k });
                      if (k !== 'auto') setState({ tier: k });
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="gx-pause-side">
          <h3>Progress</h3>
          <div className="gx-progress-row">
            <span>Islands</span>
            <div className="gx-meter"><i style={{ width: `${(discovered / ZONES.length) * 100}%` }} /></div>
            <b>{discovered}/{ZONES.length}</b>
          </div>
          <div className="gx-progress-row">
            <span>Shards</span>
            <div className="gx-meter"><i style={{ width: `${(shards / SHARDS.length) * 100}%` }} /></div>
            <b>{shards}/{SHARDS.length}</b>
          </div>
          <h3>Achievements</h3>
          <ul className="gx-ach">
            {ACHIEVEMENTS.map(a => {
              const on = got.includes(a.id);
              return (
                <li key={a.id} className={on ? 'is-on' : ''}>
                  <span>{on ? a.icon : '🔒'}</span>
                  <div>
                    <strong>{a.title}</strong>
                    <small>{a.body}</small>
                  </div>
                </li>
              );
            })}
          </ul>
          <button
            className="gx-link gx-reset"
            onClick={() => {
              if (!confirmReset) {
                setConfirmReset(true);
                return;
              }
              resetProgress();
              emit('progressReset', {});
              setConfirmReset(false);
            }}
          >
            {confirmReset ? 'Click again to reset all progress' : 'Reset progress'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
