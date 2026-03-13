import React, { useState } from 'react';
import BaseCamp from './BaseCamp';

/**
 * Root state manager for the Himalayan portfolio experience.
 *
 * State machine:
 *   screen: 'base-camp' | 'climbing' | 'summit'
 *   activePath: null | 'education' | 'work' | 'projects'
 *   contactOpen: boolean
 *
 * Phase 1: base-camp only.
 * Phase 2 will add ClimbView.
 * Phase 3 will add SummitView.
 */
export default function HimalayanExperience() {
  const [screen, setScreen] = useState('base-camp');
  const [activePath, setActivePath] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  function handleSelectPath(path) {
    setActivePath(path);
    setScreen('climbing');
    // ClimbView will be rendered here in Phase 2
  }

  function handleBackToBase() {
    setActivePath(null);
    setScreen('base-camp');
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ fontFamily: "'Rajdhani', 'Orbitron', system-ui, sans-serif" }}
    >
      {screen === 'base-camp' && (
        <BaseCamp
          onSelectPath={handleSelectPath}
          contactOpen={contactOpen}
          onOpenContact={() => setContactOpen(true)}
          onCloseContact={() => setContactOpen(false)}
        />
      )}

      {/* Placeholder for Phase 2 — ClimbView */}
      {screen === 'climbing' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-6"
          style={{
            background: 'linear-gradient(to bottom, #0a1628, #1a3d6b, #2e6fa0)',
          }}
        >
          <p
            className="text-white text-2xl font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 20px rgba(96,165,250,0.5)' }}
          >
            {activePath} — Coming in Phase 2
          </p>
          <p className="text-sky-300/70 text-sm tracking-wide">
            The climb mechanic is on its way.
          </p>
          <button
            onClick={handleBackToBase}
            className="mt-4 px-6 py-3 rounded-xl text-white text-sm font-medium tracking-wide transition-all hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              minHeight: '48px',
            }}
          >
            ← Back to Base Camp
          </button>
        </div>
      )}
    </div>
  );
}
