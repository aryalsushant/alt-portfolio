import React, { useEffect, useRef } from 'react';

function useReveal(rootMargin = '-60px') {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return ref;
}

function PlaceholderImage({ emoji, label, image }) {
  if (image) {
    return (
      <div className="relative w-full h-44 rounded-t-2xl overflow-hidden border-b border-line">
        <img src={image} alt={label} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="relative w-full h-44 rounded-t-2xl flex items-center justify-center overflow-hidden
      border-b border-line"
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
      <span className="relative text-5xl" role="img" aria-label={label}>{emoji}</span>
    </div>
  );
}

const ACHIEVEMENTS = [
  { icon: '🏆', label: '4× Hackathon Winner' },
  { icon: '💼', label: '3 Hands-On Internships' },
  { icon: '🏫', label: 'Senior Resident Assistant on Campus' },
];

const ACADEMICS = [
  { icon: '🎓', label: 'Honors Scholar' },
  { icon: '📋', label: "President's List" },
  { icon: '🥇', label: 'Academic Excellence Scholar' },
];

export default function Highlights() {
  const headerRef = useReveal();
  const card1Ref = useReveal('-40px');
  const card2Ref = useReveal('-40px');
  const card3Ref = useReveal('-40px');

  return (
    <section className="py-28 px-6 bg-bg">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-accent text-[12px] mb-4 tracking-[0.25em] uppercase font-semibold">Education Highlights</p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-5 tracking-tight">
            Highlights
          </h2>
          <div className="mx-auto w-16 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent) 50%, transparent)' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* Card 1 — Academic Excellence (no image) */}
          <div ref={card1Ref} className="reveal reveal-delay-1 flex flex-col">
            <div className="glass-card flex flex-col p-8 border border-line h-full
              hover:border-line-strong hover:-translate-y-0.5 transition-all duration-300">

              {/* GPA big number */}
              <div className="text-center mb-7">
                <div className="font-display text-7xl md:text-[80px] font-extrabold text-accent leading-none mb-2 tracking-tight tabular-nums">
                  4.0
                </div>
                <p className="text-[11px] font-mono font-semibold text-ink-2 tracking-[0.3em] uppercase">GPA</p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-line mb-5" />

              {/* Academic honors list */}
              <div className="flex flex-col gap-3.5">
                {ACADEMICS.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <span className="font-display font-semibold text-ink text-[14px]">{label}</span>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-[12px] text-ink-3 font-mono font-medium tracking-wide">
                University of Southern Mississippi
              </p>
            </div>
          </div>

          {/* Card 2 — Cornell ML Foundations (with image) */}
          <div ref={card2Ref} className="reveal reveal-delay-2 flex flex-col">
            <div className="glass-card border border-line h-full overflow-hidden
              hover:border-line-strong hover:-translate-y-0.5 transition-all duration-300">
              <PlaceholderImage
                image="/mlfoundations.jpeg"
                label="Cornell University ML Foundations"
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-bold text-ink text-xl leading-tight">
                    ML Foundations
                  </h3>
                  <span className="text-[11px] font-mono text-accent
                    bg-accent-soft border border-line-strong
                    px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 tracking-wider uppercase font-semibold">
                    Summer 2025
                  </span>
                </div>
                <p className="font-display font-semibold text-accent text-[14px] mb-3">
                  Cornell University
                </p>
                <p className="text-[15px] text-ink-2 leading-relaxed">
                  Intensive machine learning coursework with Cornell faculty. Selected via BreakThroughTech AI Program — 3,000+ applicants.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 — Achievements (no image) */}
          <div ref={card3Ref} className="reveal reveal-delay-3 flex flex-col">
            <div className="glass-card flex flex-col p-8 border border-line h-full
              hover:border-line-strong hover:-translate-y-0.5 transition-all duration-300">

              <h3 className="font-display font-bold text-ink text-xl mb-6 tracking-tight">
                Beyond Academics
              </h3>

              <div className="flex flex-col gap-3 flex-1">
                {ACHIEVEMENTS.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-xl
                    bg-accent-soft/40 border border-line
                    hover:border-accent hover:bg-accent-soft
                    transition-all duration-200">
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <span className="font-display font-semibold text-ink text-[14px] leading-snug">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
