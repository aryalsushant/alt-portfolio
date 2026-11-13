import React from 'react';
import useReveal from '../hooks/useReveal';

export default function SectionHeader({ kicker, title, intro }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal text-center mb-14">
      <p className="font-mono text-accent text-[12px] mb-4 tracking-[0.25em] uppercase font-semibold">{kicker}</p>
      <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-5 tracking-tight">{title}</h2>
      <div className="mx-auto w-16 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent) 50%, transparent)' }} />
      {intro && <p className="mt-6 text-[15px] md:text-base text-ink-2 max-w-xl mx-auto leading-relaxed">{intro}</p>}
    </div>
  );
}
