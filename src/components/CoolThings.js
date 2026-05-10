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
        background: 'linear-gradient(135deg, var(--accent-soft), transparent 65%)',
      }}>
      <div className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '16px 16px',
          color: 'var(--accent)',
        }}
      />
      <span className="relative text-5xl" role="img" aria-label={label}>{emoji}</span>
    </div>
  );
}

const THINGS = [
  {
    id: 'hackathon-org',
    emoji: '🌐',
    image: '/hack.jpeg',
    label: 'Hackathon Organizer',
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
      <div className={`glass-card border border-line overflow-hidden h-full
        hover:border-line-strong hover:-translate-y-0.5
        transition-all duration-300
        ${thing.placeholder ? 'opacity-55' : ''}`}>
        <PlaceholderImage emoji={thing.emoji} label={thing.label} image={thing.image} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-2 gap-2">
            <h3 className="font-display font-bold text-xl text-ink tracking-tight leading-tight">{thing.title}</h3>
            <span className="text-[11px] font-mono text-accent
              bg-accent-soft border border-line-strong
              px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 tracking-wider uppercase font-semibold">
              {thing.dates}
            </span>
          </div>
          <p className="text-[14px] font-semibold text-accent mb-3">{thing.subtitle}</p>
          <p className="text-[15px] text-ink-2 leading-relaxed mb-5">{thing.description}</p>
          {thing.stats.length > 0 && (
            <div className="flex gap-6 pt-4 border-t border-line">
              {thing.stats.map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-display font-extrabold text-xl text-accent tracking-tight tabular-nums">{s.value}</p>
                  <p className="text-[11px] text-ink-2 font-mono tracking-[0.18em] uppercase mt-1 font-semibold">{s.label}</p>
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
    <section className="py-28 px-6 bg-bg-soft">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-accent text-[12px] mb-4 tracking-[0.25em] uppercase font-semibold">Beyond the Code</p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-5 tracking-tight">
            Other Cool Things
          </h2>
          <div className="mx-auto w-16 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent) 50%, transparent)' }} />
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
