import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { RESEARCH } from '../interactive/content';
import useReveal from '../hooks/useReveal';
import SectionHeader from './SectionHeader';

export default function Research() {
  const ref = useReveal('-40px');
  return (
    <section className="py-28 px-6 bg-bg-soft">
      <div className="max-w-3xl mx-auto">
        <SectionHeader kicker="Publications" title="Research" />
        <article ref={ref} className="reveal glass-card border border-line p-8 md:p-10">
          <p className="text-[12px] font-mono text-accent mb-3 tracking-[0.18em] uppercase font-bold">
            {RESEARCH.venue} · {RESEARCH.date}
          </p>
          <h3 className="font-display font-bold text-2xl md:text-[28px] text-ink leading-tight tracking-tight mb-4">
            {RESEARCH.title}
          </h3>
          <p className="text-[14px] text-ink-2 mb-5">
            {RESEARCH.authors.map((a, i) => (
              <React.Fragment key={a}>
                {i > 0 && ', '}
                {a === 'S. Aryal' ? <strong className="text-ink font-semibold">{a}</strong> : a}
              </React.Fragment>
            ))}
          </p>
          <p className="text-[15px] text-ink-2 leading-relaxed mb-6">{RESEARCH.summary}</p>
          <a href={RESEARCH.href} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-[14px] font-semibold
              border border-line-strong text-ink hover:bg-accent-soft hover:border-accent hover:text-accent transition-all">
            Read on arXiv <FaExternalLinkAlt size={11} />
          </a>
        </article>
      </div>
    </section>
  );
}
