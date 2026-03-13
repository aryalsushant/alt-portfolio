import React from 'react';
import { motion } from 'framer-motion';
import { PATH_CONFIGS } from './pathConfig';
import MountainScene from './MountainScene';
import Character from './Character';
import ContactPopup from './ContactPopup';

const PATHS = Object.values(PATH_CONFIGS).map((cfg) => ({ ...cfg, count: 4 }));

// Stagger children nicely
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function BaseCamp({ onSelectPath, contactOpen, onOpenContact, onCloseContact }) {
  return (
    <div className="relative w-full h-full">
      {/* ── Background ─────────────────────────────────────────────────────── */}
      <MountainScene />

      {/* ── Content overlay ────────────────────────────────────────────────── */}
      {/*
        Desktop layout (md+):  title top → paths middle → character bottom
        Mobile layout:         title top → character → paths below
        We use flex-col and order utilities to rearrange on mobile.
      */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-between py-6 px-4 md:py-8 overflow-y-auto">

        {/* ── Title ──────────────────────────────────────────────────────────── */}
        <motion.div
          className="text-center w-full pt-2 md:pt-4"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1
            className="text-3xl md:text-5xl font-bold text-white"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: '0.06em',
              textShadow: '0 2px 24px rgba(0,0,0,0.85), 0 0 48px rgba(0,0,0,0.4)',
            }}
          >
            SUSHANT ARYAL
          </h1>
          <p
            className="mt-2 text-base md:text-lg text-sky-100/85 tracking-widest uppercase"
            style={{
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              textShadow: '0 1px 10px rgba(0,0,0,0.8)',
            }}
          >
            Software Engineer &nbsp;·&nbsp; Base Camp
          </p>
          <p
            className="mt-1 text-xs md:text-sm text-sky-200/60"
            style={{
              fontFamily: "'Rajdhani', system-ui, sans-serif",
              textShadow: '0 1px 8px rgba(0,0,0,0.7)',
            }}
          >
            Choose your trail to begin the ascent
          </p>
        </motion.div>

        {/* ── Middle section: paths above, character below (desktop) ──────── */}
        {/* On mobile: character first, paths below — using flex-col-reverse on sm */}
        <div className="flex flex-col items-center gap-6 w-full max-w-xl md:max-w-2xl">

          {/* Path buttons */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5 w-full order-2 md:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {PATHS.map((path) => {
              const { Icon } = path;
              return (
                <motion.button
                  key={path.id}
                  variants={itemVariants}
                  onClick={() => onSelectPath(path.id)}
                  className="group w-full md:w-44 flex md:flex-col items-center md:items-center gap-4 md:gap-2 px-5 md:px-4 py-4 md:py-5 rounded-2xl transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
                  style={{
                    background: path.bgColor,
                    border: `1px solid ${path.borderColor}`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    minHeight: '64px',
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: path.bgHover,
                    transition: { duration: 0.15 },
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon
                    size={22}
                    color={path.accentColor}
                    style={{ flexShrink: 0 }}
                  />
                  <div className="text-left md:text-center">
                    <div
                      className="font-bold text-white text-sm md:text-base"
                      style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.04em' }}
                    >
                      {path.label}
                    </div>
                    <div
                      className="text-white/50 text-xs mt-0.5"
                      style={{ fontFamily: "'Rajdhani', system-ui, sans-serif" }}
                    >
                      {path.count} milestones
                    </div>
                  </div>
                  {/* Chevron — mobile only */}
                  <span className="ml-auto md:hidden text-white/30 text-lg">›</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Character */}
          <motion.div
            className="flex flex-col items-center gap-2 order-1 md:order-2"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Character
              size={90}
              onClick={onOpenContact}
              className="md:scale-110"
            />
            <motion.p
              className="text-white/45 text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Rajdhani', system-ui, sans-serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              Tap me to contact
            </motion.p>
          </motion.div>
        </div>

        {/* ── Bottom spacer / altitude hint ──────────────────────────────────── */}
        <motion.p
          className="text-white/25 text-xs tracking-widest uppercase pb-1"
          style={{ fontFamily: "'Rajdhani', system-ui, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Elevation: 5364 m · Himalaya Range
        </motion.p>
      </div>

      {/* ── Contact Popup ─────────────────────────────────────────────────────── */}
      {contactOpen && <ContactPopup onClose={onCloseContact} />}
    </div>
  );
}
