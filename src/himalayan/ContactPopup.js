import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileDownload, FaTimes } from 'react-icons/fa';
import { contactData } from './data';

const LINKS = [
  {
    label: 'LinkedIn',
    href: contactData.linkedin,
    icon: FaLinkedin,
    color: '#0a66c2',
    bg: 'rgba(10,102,194,0.15)',
    border: 'rgba(10,102,194,0.4)',
  },
  {
    label: 'GitHub',
    href: contactData.github,
    icon: FaGithub,
    color: '#e6edf3',
    bg: 'rgba(230,237,243,0.1)',
    border: 'rgba(230,237,243,0.3)',
  },
  {
    label: 'Email',
    href: `mailto:${contactData.email}`,
    icon: FaEnvelope,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.35)',
  },
  {
    label: 'Download Resume',
    href: contactData.resume,
    icon: FaFileDownload,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
    border: 'rgba(52,211,153,0.35)',
    download: true,
  },
];

export default function ContactPopup({ onClose }) {
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(5,10,20,0.72)', backdropFilter: 'blur(4px)' }}
        />

        {/* Card */}
        <motion.div
          className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(20,35,60,0.97) 0%, rgba(10,20,40,0.97) 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
          }}
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <FaTimes size={14} />
          </button>

          {/* Header */}
          <div
            className="px-6 pt-8 pb-5 flex flex-col items-center text-center"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full mb-4 overflow-hidden"
              style={{
                border: '2px solid rgba(255,255,255,0.18)',
                boxShadow: '0 0 24px rgba(96,165,250,0.25)',
              }}
            >
              <img
                src="/about_me.png"
                alt="Sushant Aryal"
                className="w-full h-full object-cover"
              />
            </div>

            <h2
              className="text-white font-bold text-xl tracking-wide"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              SUSHANT ARYAL
            </h2>
            <p
              className="text-sky-300/80 text-sm mt-1 tracking-widest uppercase"
              style={{ fontFamily: "'Rajdhani', system-ui, sans-serif" }}
            >
              Software Engineer
            </p>
            <p className="text-white/40 text-xs mt-1">
              BTT AI/ML Fellow @ Cornell
            </p>
          </div>

          {/* Links */}
          <div className="px-5 py-5 flex flex-col gap-3">
            {LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.download ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  download={link.download || undefined}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: link.bg,
                    border: `1px solid ${link.border}`,
                    minHeight: '52px',
                  }}
                >
                  <Icon size={18} color={link.color} style={{ flexShrink: 0 }} />
                  <span
                    className="text-white/90 text-sm font-medium"
                    style={{ fontFamily: "'Rajdhani', system-ui, sans-serif", letterSpacing: '0.04em' }}
                  >
                    {link.label}
                  </span>
                </a>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
