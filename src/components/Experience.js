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

const EXPERIENCES = [
  {
    id: 'cayra',
    emoji: '🧠',
    title: 'AI/ML Engineer',
    company: 'Cayra.ai',
    dates: 'April 2026 – May 2026',
    colorFrom: 'from-violet-500/25',
    colorTo: 'to-purple-500/15',
    bullets: [
      'Engineered AI-driven features for an early-stage startup platform.',
      'Details to be filled in — exciting work in progress.',
      'Contributed to core ML pipeline architecture and model integration.',
    ],
  },
  {
    id: 'btt',
    emoji: '🎓',
    title: 'BreakThroughTech AI/ML Fellow',
    company: 'Cornell Tech',
    dates: 'May 2025 – Present',
    colorFrom: 'from-cyan-500/25',
    colorTo: 'to-teal-500/15',
    bullets: [
      'Selected from 3,000+ applicants for a highly competitive 12-month program.',
      'Completed Python + ML coursework with Cornell University faculty.',
      'Participated in experiential learning projects with industry mentors.',
    ],
  },
  {
    id: 'illumibot',
    emoji: '💡',
    title: 'Software Engineering Intern',
    company: 'Illumibot',
    dates: 'Oct 2025 – Dec 2025',
    colorFrom: 'from-amber-500/25',
    colorTo: 'to-orange-500/15',
    bullets: [
      'Improved UI and resolved frontend–backend integration issues across Flutter app and ReactJS + Node.js web platform.',
      'Built automation tools that automated 80% of manual PR reviews, significantly reducing engineering overhead.',
      'Streamlined projection-mapping testing workflows to improve team velocity.',
    ],
  },
  {
    id: 'dha',
    emoji: '🏥',
    title: 'Software & Data Science Intern',
    company: 'Delta Health Alliance',
    dates: 'May 2025 – July 2025',
    colorFrom: 'from-emerald-500/25',
    colorTo: 'to-green-500/15',
    bullets: [
      'Developed and taught a full Python curriculum to 40+ high school students across rural Mississippi.',
      'Built a full-stack Learning Management System using React.js, Node.js, SQL, deployed on AWS.',
      'Increased digital education access in underserved communities through hands-on instruction.',
    ],
  },
];

function PlaceholderImage({ emoji, colorFrom, colorTo }) {
  return (
    <div className={`w-full h-36 rounded-xl flex flex-col items-center justify-center gap-2
      bg-gradient-to-br ${colorFrom} ${colorTo}
      border border-white/10`}>
      <span className="text-4xl" role="img">{emoji}</span>
      <span className="text-xs font-mono text-white/40 tracking-wider">Photo Coming Soon</span>
    </div>
  );
}

function ExperienceCard({ exp, idx }) {
  const ref = useReveal('-30px');
  return (
    <div ref={ref} className={`reveal reveal-delay-${(idx % 4) + 1} relative`}>
      {/* Timeline dot */}
      <div className="absolute left-0 top-8 w-10 h-10 rounded-full flex items-center justify-center
        bg-indigo-50 dark:bg-white/5 border-2 border-indigo-300 dark:border-cyan-400/40
        z-10 text-lg">
        {exp.emoji}
      </div>

      {/* Card */}
      <div className="ml-16 glass-card border border-gray-200/80 dark:border-white/5 overflow-hidden
        hover:border-indigo-400/30 dark:hover:border-cyan-400/25 hover:scale-[1.01]
        transition-all duration-300">
        <PlaceholderImage emoji={exp.emoji} colorFrom={exp.colorFrom} colorTo={exp.colorTo} />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
            <h3 className="font-orbitron font-bold text-gray-900 dark:text-white">{exp.title}</h3>
            <span className="text-xs font-mono text-indigo-600 dark:text-cyan-400
              bg-indigo-50 dark:bg-cyan-400/10 border border-indigo-200 dark:border-cyan-400/20
              px-3 py-1 rounded-full self-start sm:self-auto">
              {exp.dates}
            </span>
          </div>
          <p className="text-sm font-semibold text-indigo-600 dark:text-cyan-400 mb-4">{exp.company}</p>
          <ul className="space-y-2">
            {exp.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="text-indigo-400 dark:text-cyan-400 mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-current" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const headerRef = useReveal();

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-indigo-600 dark:text-cyan-400 text-sm mb-3 tracking-widest uppercase">Work History</p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-5">
            Experience
          </h2>
          <div className="mx-auto w-20 h-1 bg-gradient-to-r from-indigo-600 to-transparent dark:from-cyan-400 dark:to-transparent rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-8 bottom-8 w-0.5
            bg-gradient-to-b from-indigo-300 dark:from-cyan-400/40 to-transparent" />

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
