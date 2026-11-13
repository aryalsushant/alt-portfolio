import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaApple } from 'react-icons/fa';
import { PROJECTS } from '../interactive/content';
import useReveal from '../hooks/useReveal';
import SectionHeader from './SectionHeader';

// Classic-page extras keyed by project id. Copy lives in interactive/content.js.
const MEDIA = {
  dcs: { stats: [['450+', 'campus ambassadors'], ['6', 'AI donor personas']] },
  pricycle: { icon: '/pricycle-icon.jpg' },
  hipaapotamus: { image: '/hipaa.jpeg' },
  crewly: { image: '/crewly.jpg' },
  hla: { image: '/hla.jpg' },
  'campus-menace': { image: '/campus-menace.jpg' },
};

const hasCover = p => Boolean(MEDIA[p.id] && (MEDIA[p.id].image || MEDIA[p.id].icon));

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'web', label: 'Web' },
];

function linkIcon(label) {
  if (label === 'GitHub') return <FaGithub size={15} />;
  if (label === 'App Store') return <FaApple size={15} />;
  return <FaExternalLinkAlt size={12} />;
}

function Links({ links }) {
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4 border-t border-line">
      {links.map(l => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink hover:text-accent transition-colors">
          {linkIcon(l.label)} {l.label}
        </a>
      ))}
    </div>
  );
}

function Stack({ items }) {
  return (
    <ul className="flex flex-wrap gap-1.5 mb-5" aria-label="Tech stack">
      {items.map(t => (
        <li key={t} className="px-3 py-[5px] text-[12px] rounded-md font-mono font-semibold bg-accent-soft text-accent border border-line-strong tracking-tight">
          {t}
        </li>
      ))}
    </ul>
  );
}

function Cover({ project }) {
  const m = MEDIA[project.id] || {};
  if (m.image) {
    return <img src={m.image} alt={`${project.name} screenshot`} loading="lazy" className="w-full h-full object-cover object-top" />;
  }
  return (
    <div className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${project.color}33, transparent 70%)` }}>
      <img src={m.icon} alt={`${project.name} app icon`} loading="lazy" className="w-24 h-24 rounded-[22px] shadow-lg" />
    </div>
  );
}

// Numbers panel for the featured project when there is no public screenshot.
function StatPanel({ project }) {
  const { stats = [] } = MEDIA[project.id] || {};
  return (
    <dl className="h-full flex flex-col justify-center gap-6 p-8 md:p-10"
      style={{ background: `linear-gradient(135deg, ${project.color}26, transparent 75%)` }}>
      {stats.map(([value, label]) => (
        <div key={label}>
          <dt className="sr-only">{label}</dt>
          <dd className="font-display font-extrabold text-4xl text-ink tracking-tight tabular-nums leading-none">{value}</dd>
          <dd className="mt-1.5 text-[12px] font-mono text-ink-2 tracking-[0.16em] uppercase font-semibold">{label}</dd>
        </div>
      ))}
    </dl>
  );
}

function Featured({ project }) {
  const ref = useReveal('-40px');
  return (
    <article ref={ref} className="reveal glass-card border border-line overflow-hidden rounded-2xl mb-8 grid md:grid-cols-5">
      <div className="md:col-span-2 min-h-[220px] border-b md:border-b-0 md:border-r border-line">
        {hasCover(project) ? <Cover project={project} /> : <StatPanel project={project} />}
      </div>
      <div className="md:col-span-3 p-7 md:p-9">
        <p className="text-[12px] font-mono text-accent mb-2 tracking-[0.18em] uppercase font-bold">
          Featured · Gift of Life Marrow Registry · {project.dates}
        </p>
        <h3 className="font-display font-bold text-3xl text-ink tracking-tight leading-tight mb-1">{project.name}</h3>
        <p className="font-display font-semibold text-ink-2 text-[17px] mb-4">{project.tagline}</p>
        <p className="text-[15px] text-ink-2 leading-relaxed mb-5">{project.desc}</p>
        <Stack items={project.stack} />
        <Links links={project.links} />
      </div>
    </article>
  );
}

function Card({ project, idx }) {
  const ref = useReveal('-30px');
  return (
    <article ref={ref}
      className={`reveal reveal-delay-${(idx % 3) + 1} glass-card border border-line overflow-hidden rounded-2xl flex flex-col
        hover:border-line-strong hover:-translate-y-1 transition-all duration-300`}>
      {hasCover(project) && <div className="h-44 border-b border-line overflow-hidden"><Cover project={project} /></div>}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-[12px] font-mono text-accent mb-1.5 tracking-[0.18em] uppercase font-bold">{project.tagline}</p>
        <h3 className="font-display font-bold text-[22px] text-ink tracking-tight leading-[1.15] mb-3">{project.name}</h3>
        <p className="text-[15px] text-ink-2 leading-relaxed mb-5 flex-1">{project.desc}</p>
        <Stack items={project.stack} />
        <Links links={project.links} />
      </div>
    </article>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [featured, ...rest] = PROJECTS;
  const shown = filter === 'all' ? rest : PROJECTS.filter(p => p.category === filter);

  return (
    <section className="py-28 px-6 bg-bg">
      <div className="max-w-6xl mx-auto">
        <SectionHeader kicker="What I've built" title="Projects" />

        {filter === 'all' && <Featured project={featured} />}

        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Filter projects">
          {FILTERS.map(f => (
            <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold font-display tracking-wide border transition-colors
                ${filter === f.id ? 'bg-accent text-on-accent border-accent' : 'border-line-strong text-ink-2 hover:text-ink hover:border-accent'}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((p, i) => <Card key={p.id} project={p} idx={i} />)}
        </div>
      </div>
    </section>
  );
}
