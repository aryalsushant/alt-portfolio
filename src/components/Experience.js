import React from 'react';
import { EXPERIENCE } from '../interactive/content';
import useReveal from '../hooks/useReveal';
import SectionHeader from './SectionHeader';

// Classic-page extras keyed by experience id. Copy lives in interactive/content.js.
const EXTRAS = {
  giftoflife: { emoji: '🧬' },
  btt: { emoji: '🎓', image: '/btt.jpeg' },
  lumibot: { emoji: '💡', image: '/illumi.jpeg' },
  dha: { emoji: '🏥', image: '/dha.jpeg' },
};

const EXPERIENCES = EXPERIENCE.map(e => ({ ...e, ...(EXTRAS[e.id] || { emoji: '💼' }) }));

function PlaceholderImage({ emoji, image, label }) {
  if (image) {
    return (
      <div className="relative w-full h-36 rounded-xl overflow-hidden border border-line">
        <img src={image} alt={label || ''} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="relative w-full h-36 rounded-xl flex items-center justify-center overflow-hidden
      border border-line"
      style={{
        background: 'linear-gradient(135deg, var(--accent-soft), transparent 60%)',
      }}>
      <div className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '14px 14px',
          color: 'var(--accent)',
        }}
      />
      <span className="relative text-4xl" role="img">{emoji}</span>
    </div>
  );
}

function ExperienceCard({ exp, idx }) {
  const ref = useReveal('-30px');
  return (
    <div ref={ref} className={`reveal reveal-delay-${(idx % 4) + 1} relative`}>
      {/* Timeline dot */}
      <div className="absolute left-0 top-8 w-10 h-10 rounded-full flex items-center justify-center
        bg-accent-soft border-2 border-accent
        z-10 text-lg shadow-sm">
        {exp.emoji}
      </div>

      {/* Card */}
      <div className="ml-16 glass-card border border-line overflow-hidden
        hover:border-line-strong hover:-translate-y-0.5
        transition-all duration-300">
        {exp.image && <PlaceholderImage emoji={exp.emoji} image={exp.image} label={`${exp.title} at ${exp.company}`} />}
        <div className="p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1.5">
            <h3 className="font-display font-bold text-xl text-ink leading-tight tracking-tight">{exp.title}</h3>
            <span className="text-[11px] font-mono text-accent
              bg-accent-soft border border-line-strong
              px-3 py-1 rounded-full self-start sm:self-auto tracking-wider uppercase font-semibold whitespace-nowrap">
              {exp.dates}
            </span>
          </div>
          <p className="text-[15px] font-semibold text-accent mb-5">{exp.company}<span className="text-ink-3 font-medium"> · {exp.location}</span></p>
          <ul className="space-y-3">
            {exp.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-[15px] text-ink-2 leading-relaxed">
                <span className="text-accent mt-[9px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-current" />
                <span className="flex-1">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section className="py-28 px-6 bg-bg-soft">
      <div className="max-w-3xl mx-auto">

        <SectionHeader kicker="Work history" title="Experience" />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-8 bottom-8 w-0.5"
            style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />

          <div className="flex flex-col gap-10">
            {EXPERIENCES.map((exp, idx) => (
              <ExperienceCard key={exp.id} exp={exp} idx={idx} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
