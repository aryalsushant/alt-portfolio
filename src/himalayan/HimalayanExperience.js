import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BaseCamp from './BaseCamp';
import ClimbView from './ClimbView';

/**
 * Root state manager for the Himalayan portfolio experience.
 *
 * State machine:
 *   screen: 'base-camp' | 'climbing' | 'summit'
 *   activePath: null | 'education' | 'work' | 'projects'
 *   contactOpen: boolean (base-camp level; ClimbView manages its own)
 *
 * Phase 1: base-camp ✓
 * Phase 2: climbing  ✓
 * Phase 3: summit    (placeholder below — will be fleshed out in Phase 3)
 */
export default function HimalayanExperience() {
  const [screen, setScreen]           = useState('base-camp');
  const [activePath, setActivePath]   = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  function handleSelectPath(path) {
    setActivePath(path);
    setScreen('climbing');
  }

  function handleBackToBase() {
    setActivePath(null);
    setScreen('base-camp');
  }

  function handleSummit() {
    setScreen('summit');
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ fontFamily: "'Rajdhani', 'Orbitron', system-ui, sans-serif" }}
    >
      <AnimatePresence mode="wait">

        {screen === 'base-camp' && (
          <motion.div
            key="base-camp"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <BaseCamp
              onSelectPath={handleSelectPath}
              contactOpen={contactOpen}
              onOpenContact={() => setContactOpen(true)}
              onCloseContact={() => setContactOpen(false)}
            />
          </motion.div>
        )}

        {screen === 'climbing' && (
          <motion.div
            key={`climb-${activePath}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ClimbView
              path={activePath}
              onBackToBase={handleBackToBase}
              onSummit={handleSummit}
            />
          </motion.div>
        )}

        {/* ── Summit — Phase 3 placeholder ─────────────────────────────── */}
        {screen === 'summit' && (
          <motion.div
            key="summit"
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
            style={{
              background: 'linear-gradient(to bottom, #e8f4f8 0%, #c8dce8 30%, #9abace 60%, #1a3d6b 100%)',
            }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
              className="text-6xl"
            >
              🏔️
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2
                className="text-2xl md:text-4xl font-bold text-white"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                  letterSpacing: '0.05em',
                }}
              >
                YOU'VE REACHED
              </h2>
              <h2
                className="text-3xl md:text-5xl font-bold mt-1"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: '#fbbf24',
                  textShadow: '0 0 30px rgba(251,191,36,0.5)',
                  letterSpacing: '0.05em',
                }}
              >
                THE SUMMIT
              </h2>
              <p
                className="mt-3 text-white/65 text-base tracking-wide"
                style={{ fontFamily: "'Rajdhani', system-ui, sans-serif" }}
              >
                8,848 m · {activePath?.toUpperCase()} PATH COMPLETE
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-xs sm:max-w-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <button
                onClick={handleBackToBase}
                className="flex-1 px-6 py-3.5 rounded-2xl text-white font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '0.04em',
                  fontSize: '11px',
                  minHeight: '52px',
                }}
              >
                ← BASE CAMP
              </button>

              <button
                onClick={() => setScreen('climbing')}
                className="flex-1 px-6 py-3.5 rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none"
                style={{
                  background: 'rgba(251,191,36,0.2)',
                  border: '1px solid rgba(251,191,36,0.45)',
                  color: '#fbbf24',
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '0.04em',
                  fontSize: '11px',
                  minHeight: '52px',
                }}
              >
                CLIMB AGAIN
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
