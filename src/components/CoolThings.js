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
      <span className="text-xs font-mono text-white/40 tracking-wider">Photo Coming Soon</span>
    </div>
  );
}

const THINGS = [
  {
    id: 'hackathon-org',
    emoji: '🌐',
    label: 'Hackathon Organizer',
    colorFrom: 'from-indigo-500/30',
    colorTo: 'to-violet-500/20',
    title: 'Hackathon Organizer',
    subtitle: 'Nepal-US Hackathon · Nepali Leaders Network',
    dates: 'Jan – Mar 2026',
    description: 'One of 8 core organizers. Managed 1,350+ applications at a 33% acceptance rate. Recruited and coordinated 44 mentors, 8 judges, 5 keynote speakers, and 2 workshop leads.',
    stats: [
      { label: 'Applications', value: '1,350+' },
      { label: 'Acceptance', value: '33%' },
      { label: 'Mentors', value: '44' },
    ],
    placeholder: false,
  },
  {
    id: 'placeholder-1',
    emoji: '✨',
    label: 'Coming Soon',
    colorFrom: 'from-rose-500/20',
    colorTo: 'to-pink-500/15',
    title: 'Coming Soon',
    subtitle: 'Future Achievement',
    dates: 'TBD',
    description: 'More exciting accomplishments and initiatives in progress. Check back soon.',
    stats: [],
    placeholder: true,
  },
  {
    id: 'placeholder-2',
    emoji: '🌱',
    label: 'Coming Soon',
    colorFrom: 'from-teal-500/20',
    colorTo: 'to-emerald-500/15',
    title: 'Coming Soon',
    subtitle: 'Future Achievement',
    dates: 'TBD',
    description: 'Growing constantly. Next chapter loading...',
    stats: [],
    placeholder: true,
  },
];

function CoolCard({ thing, idx }) {
  const ref = useReveal('-30px');
  return (
    <div ref={ref} className={`reveal reveal-delay-${idx + 1}`}>
      <div className={`glass-card border border-gray-200/80 dark:border-white/5 overflow-hidden h-full
        hover:border-indigo-400/30 dark:hover:border-cyan-400/30
        hover:scale-[1.02] hover:-translate-y-0.5
        transition-all duration-300
        ${thing.placeholder ? 'opacity-55' : ''}`}>
        <PlaceholderImage emoji={thing.emoji} label={thing.label} colorFrom={thing.colorFrom} colorTo={thing.colorTo} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-1 gap-2">
            <h3 className="font-orbitron font-bold text-gray-900 dark:text-white">{thing.title}</h3>
            <span className="text-xs font-mono text-indigo-600 dark:text-cyan-400
              bg-indigo-50 dark:bg-cyan-400/10 border border-indigo-200 dark:border-cyan-400/20
              px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
              {thing.dates}
            </span>
          </div>
          <p className="text-sm font-medium text-indigo-600 dark:text-cyan-400/80 mb-3">{thing.subtitle}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{thing.description}</p>
          {thing.stats.length > 0 && (
            <div className="flex gap-4 pt-3 border-t border-gray-100 dark:border-white/5">
              {thing.stats.map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-orbitron font-bold text-lg text-indigo-600 dark:text-cyan-400">{s.value}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoolThings() {
  const headerRef = useReveal();

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-indigo-600 dark:text-cyan-400 text-sm mb-3 tracking-widest uppercase">Beyond the Code</p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-5">
            Other Cool Things
          </h2>
          <div className="mx-auto w-20 h-1 bg-gradient-to-r from-indigo-600 to-transparent dark:from-cyan-400 dark:to-transparent rounded-full" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THINGS.map((t, i) => (
            <CoolCard key={t.id} thing={t} idx={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
