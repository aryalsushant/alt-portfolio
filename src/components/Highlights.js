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

function PlaceholderImage({ emoji, label, colorFrom, colorTo }) {
  return (
    <div className={`w-full h-44 rounded-t-2xl flex flex-col items-center justify-center gap-2.5
      bg-gradient-to-br ${colorFrom} ${colorTo}
      border-b border-white/10`}>
      <span className="text-5xl" role="img" aria-label={label}>{emoji}</span>
      <span className="text-xs font-mono text-white/50 tracking-wider">Photo Coming Soon</span>
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
    <section className="py-24 px-6 bg-white dark:bg-[#070b14]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-indigo-600 dark:text-cyan-400 text-sm mb-3 tracking-widest uppercase">Education Highlights</p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-5">
            Highlights
          </h2>
          <div className="mx-auto w-20 h-1 bg-gradient-to-r from-indigo-600 to-transparent dark:from-cyan-400 dark:to-transparent rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* Card 1 — Academic Excellence (no image) */}
          <div ref={card1Ref} className="reveal reveal-delay-1 flex flex-col">
            <div className="glass-card flex flex-col p-8 border border-gray-200/80 dark:border-white/5 h-full
              hover:border-indigo-400/40 dark:hover:border-cyan-400/30 transition-all duration-300">

              {/* GPA big number */}
              <div className="text-center mb-6">
                <div className="font-display text-7xl font-extrabold text-indigo-600 dark:text-cyan-400 leading-none mb-1">
                  4.0
                </div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">GPA</p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gray-100 dark:bg-white/5 mb-5" />

              {/* Academic honors list */}
              <div className="flex flex-col gap-3">
                {ACADEMICS.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <span className="font-display font-semibold text-gray-800 dark:text-gray-100 text-sm">{label}</span>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs text-gray-400 dark:text-gray-500 font-mono">
                University of Southern Mississippi
              </p>
            </div>
          </div>

          {/* Card 2 — Cornell ML Foundations (with image) */}
          <div ref={card2Ref} className="reveal reveal-delay-2 flex flex-col">
            <div className="glass-card border border-gray-200/80 dark:border-white/5 h-full overflow-hidden
              hover:border-indigo-400/40 dark:hover:border-cyan-400/30 transition-all duration-300">
              <PlaceholderImage
                emoji="🌿"
                label="Cornell University ML Foundations"
                colorFrom="from-emerald-500/30"
                colorTo="to-teal-500/20"
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg leading-tight">
                    ML Foundations
                  </h3>
                  <span className="text-xs font-mono text-indigo-600 dark:text-cyan-400
                    bg-indigo-50 dark:bg-cyan-400/10 border border-indigo-200 dark:border-cyan-400/20
                    px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                    Summer 2025
                  </span>
                </div>
                <p className="font-display font-semibold text-indigo-600 dark:text-cyan-400 text-sm mb-3">
                  Cornell University
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Intensive machine learning coursework with Cornell faculty. Selected via BreakThroughTech AI Program — 3,000+ applicants.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 — Achievements (no image) */}
          <div ref={card3Ref} className="reveal reveal-delay-3 flex flex-col">
            <div className="glass-card flex flex-col p-8 border border-gray-200/80 dark:border-white/5 h-full
              hover:border-indigo-400/40 dark:hover:border-cyan-400/30 transition-all duration-300">

              <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-6">
                Beyond Academics
              </h3>

              <div className="flex flex-col gap-4 flex-1">
                {ACHIEVEMENTS.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-xl
                    bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/5
                    hover:border-indigo-300 dark:hover:border-cyan-400/30 transition-all duration-200">
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <span className="font-display font-semibold text-black dark:text-black text-sm leading-snug">
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
