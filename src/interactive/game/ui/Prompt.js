import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../core/store';

export default function Prompt({ onInteract }) {
  const prompt = useGame(s => s.prompt);
  const panel = useGame(s => s.panel);
  const touch = useGame(s => s.touch);
  const show = prompt && !panel;
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key={prompt.id}
          className="gx-prompt"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          onClick={onInteract}
        >
          {!touch && <kbd>E</kbd>}
          <span className="gx-prompt-verb">{prompt.verb}</span>
          <span className="gx-prompt-label">{prompt.label}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
