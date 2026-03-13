import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { pathData } from './data';
import { PATH_CONFIGS } from './pathConfig';
import MountainScene from './MountainScene';
import Character from './Character';
import ContactPopup from './ContactPopup';
import MilestoneCard from './MilestoneCard';

/**
 * ClimbView — the scroll-based ascent screen.
 *
 * Step 0 would be "just arrived", but we skip it and start at step 1.
 * steps 1..N  →  milestone cards
 * After step N, advance() calls onSummit().
 *
 * Scroll down  = advance (climb higher)
 * Scroll up    = retreat (step back down)
 * Touch swipe up   = advance
 * Touch swipe down = retreat
 * Arrow Up / Right = advance
 * Arrow Down / Left = retreat
 */
export default function ClimbView({ path, onBackToBase, onSummit }) {
  const milestones   = pathData[path];
  const totalSteps   = milestones.length;           // 4
  const pathConfig   = PATH_CONFIGS[path];

  const [step, setStep]             = useState(0);  // 0 = at base, 1..N = milestones
  const [direction, setDirection]   = useState(1);  // 1=up, -1=down
  const [contactOpen, setContactOpen] = useState(false);

  // Throttle scroll/swipe so one gesture = one step
  const isTransitioning = useRef(false);
  const touchStartY     = useRef(null);

  // ── progress (0..1): 0 at base/step 0, 1 at final milestone
  const progress = step === 0 ? 0 : (step - 1) / Math.max(totalSteps - 1, 1);

  // ── character bottom%: 3% at base → 63% at summit step
  const charBottom = 3 + (step / totalSteps) * 60;

  // ── cold-air overlay opacity: builds as you climb
  const altitudeOpacity = (step / totalSteps) * 0.72;

  // ─────────────────────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setTimeout(() => { isTransitioning.current = false; }, 650);

    setDirection(1);
    setStep((s) => {
      if (s >= totalSteps) {
        onSummit();
        return s;
      }
      return s + 1;
    });
  }, [totalSteps, onSummit]);

  const retreat = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setTimeout(() => { isTransitioning.current = false; }, 650);

    setDirection(-1);
    setStep((s) => {
      if (s <= 0) {
        onBackToBase();
        return s;
      }
      return s - 1;
    });
  }, [onBackToBase]);

  // ── Event listeners ───────────────────────────────────────────────────────
  useEffect(() => {
    function handleWheel(e) {
      e.preventDefault();
      if (e.deltaY > 8)       advance();
      else if (e.deltaY < -8) retreat();
    }

    function handleKeyDown(e) {
      if (e.key === 'ArrowUp'   || e.key === 'ArrowRight') advance();
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft')  retreat();
    }

    function handleTouchStart(e) {
      touchStartY.current = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
      if (touchStartY.current === null) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 50) {
        dy > 0 ? advance() : retreat();
      }
      touchStartY.current = null;
    }

    window.addEventListener('wheel',      handleWheel,      { passive: false });
    window.addEventListener('keydown',    handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend',   handleTouchEnd,   { passive: true });

    return () => {
      window.removeEventListener('wheel',      handleWheel);
      window.removeEventListener('keydown',    handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend',   handleTouchEnd);
    };
  }, [advance, retreat]);

  // ─────────────────────────────────────────────────────────────────────────
  // milestone is null on step 0 (character at base, no card shown)
  const milestone  = step >= 1 ? milestones[step - 1] : null;
  const { accentColor, accentRgb, label: pathLabel, Icon: PathIcon } = pathConfig;

  return (
    <div className="relative w-full h-full select-none">

      {/* ── Background ─────────────────────────────────────────────────── */}
      <MountainScene pathType={path} />

      {/* ── Cold-air altitude overlay (fades in as you climb) ──────────── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: altitudeOpacity,
          background: `linear-gradient(to bottom,
            rgba(210,232,248,0.75) 0%,
            rgba(225,240,252,0.45) 40%,
            rgba(240,248,255,0.15) 70%,
            transparent 100%)`,
        }}
      />

      {/* ── Top navigation bar ─────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center px-4 py-3 md:px-6 md:py-4 gap-3"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,12,28,0.7) 0%, transparent 100%)',
        }}
      >
        {/* Back button */}
        <button
          onClick={onBackToBase}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/70 hover:text-white transition-colors hover:bg-white/10 focus:outline-none"
          style={{
            fontFamily: "'Rajdhani', system-ui, sans-serif",
            letterSpacing: '0.06em',
            fontSize: '13px',
            minHeight: '44px',
            minWidth: '44px',
          }}
          aria-label="Back to Base Camp"
        >
          <FaChevronLeft size={11} />
          <span className="hidden sm:inline">BASE CAMP</span>
        </button>

        {/* Path label */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <PathIcon size={14} color={accentColor} />
          <span
            className="text-white font-bold tracking-widest uppercase text-sm"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {pathLabel}
          </span>
        </div>

        {/* Altitude tag */}
        <div
          className="text-xs tracking-wide"
          style={{
            fontFamily: "'Rajdhani', system-ui, sans-serif",
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.08em',
          }}
        >
          {Math.round(5364 + progress * 3490)}m
        </div>
      </div>

      {/* ── Animated character on the trail ────────────────────────────── */}
      <motion.div
        className="absolute left-1/2 z-10"
        style={{ transform: 'translateX(-50%)' }}
        animate={{ bottom: `${charBottom}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
      >
        <Character size={80} onClick={() => setContactOpen(true)} />
      </motion.div>

      {/* ── Milestone card (only when a milestone is active) ───────────── */}
      {/*
        Desktop: right side, vertically centred
        Mobile:  upper area, horizontally centred
      */}
      <AnimatePresence>
        {milestone && (
          <motion.div
            key="card-container"
            className="
              absolute z-20
              left-1/2 -translate-x-1/2 top-[68px] w-[min(92vw,360px)]
              md:left-auto md:translate-x-0 md:-translate-y-1/2 md:right-5 md:top-1/2 md:w-[400px]
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MilestoneCard
              milestone={milestone}
              pathConfig={pathConfig}
              stepNum={step}
              totalSteps={totalSteps}
              direction={direction}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step-0 start prompt: character at base, inviting first scroll ── */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-center px-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: 0.5 }}
          >
            <p
              className="text-white/80 text-base tracking-widest uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '13px' }}
            >
              {pathLabel} Trail
            </p>
            <p
              className="text-white/45 text-xs tracking-wide"
              style={{ fontFamily: "'Rajdhani', system-ui, sans-serif" }}
            >
              {totalSteps} milestones ahead
            </p>
            <motion.div
              className="flex flex-col items-center gap-1 mt-1"
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <FaChevronDown size={14} color={accentColor} />
            </motion.div>
            <span
              className="text-white/30 text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Rajdhani', system-ui, sans-serif" }}
            >
              scroll to begin
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav buttons (up/down) visible once climbing has started ─────── */}
      <AnimatePresence>
        {step > 0 && step <= totalSteps && (
          <motion.div
            className="absolute bottom-6 right-6 z-20 flex items-center gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <button
              onClick={advance}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 focus:outline-none"
              style={{
                background: `rgba(${accentRgb},0.18)`,
                border: `1px solid rgba(${accentRgb},0.4)`,
              }}
              aria-label="Next milestone"
            >
              <FaChevronUp size={13} color={accentColor} />
            </button>
            <button
              onClick={retreat}
              className="w-11 h-11 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              aria-label="Previous milestone"
            >
              <FaChevronDown size={13} color="rgba(255,255,255,0.55)" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Summit call-to-action on final milestone ────────────────────── */}
      <AnimatePresence>
        {step === totalSteps && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={advance}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none"
              style={{
                background: `rgba(${accentRgb},0.22)`,
                border: `1px solid rgba(${accentRgb},0.55)`,
                color: accentColor,
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '0.06em',
                fontSize: '11px',
                minHeight: '48px',
                boxShadow: `0 0 20px rgba(${accentRgb},0.2)`,
              }}
            >
              REACH THE SUMMIT ↑
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Contact Popup ───────────────────────────────────────────────── */}
      {contactOpen && <ContactPopup onClose={() => setContactOpen(false)} />}
    </div>
  );
}
