import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../core/store';
import { ACHIEVEMENTS } from '../core/achievements';

export default function Toasts() {
  const toasts = useGame(s => s.toasts);
  return (
    <div className="gx-toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map(t => {
          const ach = t.kind === 'achievement' ? ACHIEVEMENTS.find(a => a.title === t.title) : null;
          return (
            <motion.div
              key={t.id}
              layout
              className={`gx-toast gx-toast--${t.kind}`}
              style={t.color ? { '--accent': t.color } : undefined}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            >
              <span className="gx-toast-icon">{t.kind === 'achievement' ? ach?.icon || '🏅' : t.icon || '✦'}</span>
              <div>
                <small>{t.kind === 'achievement' ? 'Achievement unlocked' : t.kind === 'zone' ? t.body : 'Progress'}</small>
                <strong>{t.title}</strong>
                {t.kind !== 'zone' && <span>{t.body}</span>}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
