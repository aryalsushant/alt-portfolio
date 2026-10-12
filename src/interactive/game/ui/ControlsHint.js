import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../core/store';
import { on } from '../core/events';

// Contextual first-run hints that retire themselves once the player
// has demonstrated each move.
const DESKTOP = [
  { id: 'move', keys: ['W', 'A', 'S', 'D'], text: 'to move', done: 'firstSteps' },
  { id: 'jump', keys: ['Space'], text: 'to jump · twice to double jump', done: 'airborne' },
  { id: 'dash', keys: ['Shift'], text: 'to dash', done: 'dash' },
  { id: 'look', keys: ['Drag'], text: 'to look around · M for the map', done: null },
];
const TOUCH = [
  { id: 'move', keys: ['Left thumb'], text: 'to move', done: 'firstSteps' },
  { id: 'jump', keys: ['⤒'], text: 'jump · tap again in the air', done: 'airborne' },
  { id: 'dash', keys: ['⇢'], text: 'to dash', done: 'dash' },
  { id: 'look', keys: ['Drag right'], text: 'to look around', done: null },
];

export default function ControlsHint() {
  const touch = useGame(s => s.touch);
  const got = useGame(s => s.achievements);
  const panel = useGame(s => s.panel);
  const [lookDone, setLookDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => on('panelOpened', () => setLookDone(true)), []);

  const list = touch ? TOUCH : DESKTOP;
  const next = list.find(h => (h.done ? !got.includes(h.done) : !lookDone && elapsed < 40));
  const show = next && !panel && elapsed > 1 && elapsed < 90;

  return (
    <div className="gx-hint-wrap">
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key={next.id}
            className="gx-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {next.keys.map(k => (
              <kbd key={k}>{k}</kbd>
            ))}
            <span>{next.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
