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
    id: 'gol',
    emoji: '🧬',
    image: null,
    title: 'AI Engineer Intern',
    company: 'Gift of Life Marrow Registry',
    dates: 'June 2026 – Present',
    bullets: [
      'Building AI-powered tooling to support the mission of matching donors with patients.',
    ],
  },
  {
    id: 'btt',
    emoji: '🎓',
    image: '/btt.jpeg',
    title: 'BreakThroughTech AI/ML Fellow',
    company: 'Cornell Tech',
    dates: 'May 2025 – Present',
    bullets: [
      'Selected from 3,000+ applicants for a highly competitive 12-month program.',
      'Completed Python + ML coursework with Cornell University faculty.',
      'Participated in experiential learning projects with industry mentors.',
    ],
  },
  {
    id: 'illumibot',
    emoji: '💡',
    image: '/illumi.jpeg',
    title: 'Software Engineering Intern',
    company: 'Illumibot',
    dates: 'Oct 2025 – Dec 2025',
    bullets: [
      'Improved UI and resolved frontend–backend integration issues across Flutter app and ReactJS + Node.js web platform.',
      'Built automation tools that automated 80% of manual PR reviews, significantly reducing engineering overhead.',
      'Streamlined projection-mapping testing workflows to improve team velocity.',
    ],
  },
  {
    id: 'dha',
    emoji: '🏥',
    image: '/dha.jpeg',
    title: 'Software & Data Science Intern',
    company: 'Delta Health Alliance',
    dates: 'May 2025 – July 2025',
    bullets: [
      'Developed and taught a full Python curriculum to 40+ high school students across rural Mississippi.',
      'Built a full-stack Learning Management System using React.js, Node.js, SQL, deployed on AWS.',
      'Increased digital education access in underserved communities through hands-on instruction.',
    ],
  },
];

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
        <PlaceholderImage emoji={exp.emoji} image={exp.image} label={`${exp.title} at ${exp.company}`} />
        <div className="p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1.5">
            <h3 className="font-display font-bold text-xl text-ink leading-tight tracking-tight">{exp.title}</h3>
            <span className="text-[11px] font-mono text-accent
              bg-accent-soft border border-line-strong
              px-3 py-1 rounded-full self-start sm:self-auto tracking-wider uppercase font-semibold whitespace-nowrap">
              {exp.dates}
            </span>
          </div>
          <p className="text-[15px] font-semibold text-accent mb-5">{exp.company}</p>
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
  const headerRef = useReveal();

  return (
    <section className="py-28 px-6 bg-bg-soft">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-accent text-[12px] mb-4 tracking-[0.25em] uppercase font-semibold">Work History</p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-5 tracking-tight">
            Experience
          </h2>
          <div className="mx-auto w-16 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent) 50%, transparent)' }} />
        </div>

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
