import React from 'react';
import { AWARDS } from '../interactive/content';
import useReveal from '../hooks/useReveal';
import SectionHeader from './SectionHeader';

const PLACE = { 1: '1st', 2: '2nd', 3: '3rd' };

const ORGANIZER = {
  title: 'Hackathon Organizer',
  subtitle: 'Nepal-US Hackathon · Nepali Leaders Network',
  dates: 'Jan – Mar 2026',
  image: '/hack.jpeg',
  description: 'One of 8 core organizers. Managed 1,350+ applications at a 33% acceptance rate. Recruited and coordinated 44 mentors, 8 judges, 5 keynote speakers, and 2 workshop leads.',
  stats: [
    { label: 'Applications', value: '1,350+' },
    { label: 'Acceptance', value: '33%' },
    { label: 'Mentors', value: '44' },
  ],
};

export default function Awards() {
  const listRef = useReveal('-40px');
  const orgRef = useReveal('-40px');
  return (
    <section className="py-28 px-6 bg-bg">
      <div className="max-w-5xl mx-auto">
        <SectionHeader kicker="Recognition" title="Awards & Community" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          <div ref={listRef} className="reveal reveal-delay-1 glass-card border border-line p-7">
            <h3 className="font-display font-bold text-xl text-ink mb-5 tracking-tight">Hackathons & competitions</h3>
            <ol className="flex flex-col gap-3">
              {AWARDS.map(a => (
                <li key={a.id} className="flex items-center gap-4 p-4 rounded-xl border border-line bg-surface">
                  <span className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display font-extrabold text-[15px] bg-accent-soft text-accent border border-line-strong tabular-nums">
                    {PLACE[a.place] || a.place}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display font-semibold text-ink text-[15px] leading-snug">{a.title}</span>
                    <span className="block text-[14px] text-ink-2 leading-snug">{a.event}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <article ref={orgRef} className="reveal reveal-delay-2 glass-card border border-line overflow-hidden flex flex-col">
            <div className="h-44 overflow-hidden border-b border-line">
              <img src={ORGANIZER.image} alt="Nepal-US Hackathon organizing team" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-2 gap-2">
                <h3 className="font-display font-bold text-xl text-ink tracking-tight leading-tight">{ORGANIZER.title}</h3>
                <span className="text-[11px] font-mono text-accent bg-accent-soft border border-line-strong px-2.5 py-1 rounded-full whitespace-nowrap tracking-wider uppercase font-semibold">
                  {ORGANIZER.dates}
                </span>
              </div>
              <p className="text-[14px] font-semibold text-accent mb-3">{ORGANIZER.subtitle}</p>
              <p className="text-[15px] text-ink-2 leading-relaxed mb-5 flex-1">{ORGANIZER.description}</p>
              <div className="flex gap-8 pt-4 border-t border-line">
                {ORGANIZER.stats.map(s => (
                  <div key={s.label}>
                    <p className="font-display font-extrabold text-xl text-accent tracking-tight tabular-nums">{s.value}</p>
                    <p className="text-[11px] text-ink-2 font-mono tracking-[0.18em] uppercase mt-1 font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
