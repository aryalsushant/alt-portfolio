import React from 'react';
import { SKILLS } from '../interactive/content';
import useReveal from '../hooks/useReveal';
import SectionHeader from './SectionHeader';

function Group({ group, idx }) {
  const ref = useReveal('-30px');
  return (
    <div ref={ref} className={`reveal reveal-delay-${(idx % 4) + 1} glass-card border border-line p-6`}>
      <h3 className="font-display font-bold text-lg text-ink mb-4 tracking-tight">{group.group}</h3>
      <ul className="flex flex-wrap gap-1.5">
        {group.items.map(s => (
          <li key={s} className="px-3 py-[5px] text-[13px] rounded-md font-mono font-medium bg-accent-soft text-ink border border-line">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  return (
    <section className="py-28 px-6 bg-bg-soft">
      <div className="max-w-5xl mx-auto">
        <SectionHeader kicker="Toolbox" title="Skills" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILLS.map((g, i) => <Group key={g.id} group={g} idx={i} />)}
        </div>
      </div>
    </section>
  );
}
