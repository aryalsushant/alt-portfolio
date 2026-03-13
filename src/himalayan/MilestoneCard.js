import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';

/**
 * A single milestone card shown during the climb.
 *
 * Props:
 *   milestone    — { id, title, description, thumbnail, link }
 *   pathConfig   — from PATH_CONFIGS (accent color, Icon, etc.)
 *   stepNum      — 1-based current step
 *   totalSteps   — total number of milestones
 *   direction    — 1 (advancing up) | -1 (retreating down)
 */
export default function MilestoneCard({ milestone, pathConfig, stepNum, totalSteps, direction }) {
  const { Icon, accentColor, accentRgb, borderColor } = pathConfig;

  // Cards slide vertically to reinforce the climbing metaphor:
  // advancing → card arrives from below and exits upward
  // retreating → card arrives from above and exits downward
  const enterY  = direction >= 0 ?  48 : -48;
  const exitY   = direction >= 0 ? -32 :  32;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={milestone.id}
        initial={{ opacity: 0, y: enterY }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: exitY }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="w-full rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(8,18,36,0.86)',
          border: `1px solid ${borderColor}`,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(${accentRgb},0.08)`,
        }}
      >
        {/* ── Thumbnail / placeholder ─────────────────────────────────────── */}
        <div
          className="w-full relative overflow-hidden"
          style={{ paddingBottom: '52%' }}
        >
          {milestone.thumbnail ? (
            <img
              src={milestone.thumbnail}
              alt={milestone.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* Gradient placeholder with centred icon */
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg,
                  rgba(${accentRgb},0.12) 0%,
                  rgba(${accentRgb},0.24) 100%)`,
              }}
            >
              <Icon size={36} color={accentColor} style={{ opacity: 0.4 }} />
            </div>
          )}

          {/* Step counter badge — top right of thumbnail */}
          <div
            className="absolute top-2.5 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(6px)',
              color: accentColor,
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              letterSpacing: '0.06em',
              border: `1px solid rgba(${accentRgb},0.3)`,
            }}
          >
            {stepNum} / {totalSteps}
          </div>
        </div>

        {/* ── Progress dots ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 px-6 pt-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i + 1 === stepNum ? 20 : 6,
                height: 6,
                background: i + 1 === stepNum
                  ? accentColor
                  : i + 1 < stepNum
                    ? `rgba(${accentRgb},0.45)`
                    : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="px-6 pt-3 pb-6">
          <h3
            className="text-white font-bold text-base md:text-lg leading-snug"
            style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.02em' }}
          >
            {milestone.title}
          </h3>
          <p
            className="text-white/60 text-sm mt-2 leading-relaxed"
            style={{ fontFamily: "'Rajdhani', system-ui, sans-serif" }}
          >
            {milestone.description}
          </p>

          <a
            href={milestone.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2"
            style={{
              background: `rgba(${accentRgb},0.14)`,
              border: `1px solid rgba(${accentRgb},0.4)`,
              color: accentColor,
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              letterSpacing: '0.05em',
              minHeight: '44px',
              focusRingColor: accentColor,
            }}
          >
            Visit
            <FaExternalLinkAlt size={10} />
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
