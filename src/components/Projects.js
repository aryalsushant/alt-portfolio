import React, { useEffect, useRef, useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

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

const ALL_PROJECTS = [
  {
    id: 'druglytics',
    title: 'Druglytics',
    subtitle: 'Hacklytics 2025',
    description: 'Analyzed 300K+ drug interactions using NLP and LLMs to warn users of allergic conflicts. Full-stack app with secure MongoDB backend deployed on AWS EC2.',
    stack: ['Python', 'Streamlit', 'AWS', 'Cloudflare', 'Flask', 'MongoDB'],
    emoji: '💊',
    image: '/drug.png',
    github: 'https://github.com/aryalsushant/hacklytics2025',
    demo: 'https://devpost.com/software/druglytics',
  },
  {
    id: 'swipedin',
    title: 'Swiped-In',
    subtitle: 'HackNYU 2025',
    description: 'AI-powered hiring app matching job seekers with recruiters via swiping interface. Gemini AI interviews + ElevenLabs voice screening. MVP built in 18 hours.',
    stack: ['JavaScript', 'Node.js', 'MongoDB', 'Google Gemini', 'ElevenLabs'],
    emoji: '🤝',
    image: '/swipe.png',
    github: 'https://github.com/rupaut98/swipedin',
    demo: 'https://devpost.com/software/swiped-in',
  },
  {
    id: 'hipaa',
    title: 'HIPAApotamus',
    subtitle: 'Hatchathon 2025 Winner',
    description: 'HIPAA Contract Management System for health clinics. Won Hatchathon 2025. Contacted by Mississippi Dept. of IT for a joint follow-up project.',
    stack: ['Next.js', 'OpenAI', 'AWS', 'TypeScript'],
    emoji: '🏥',
    image: '/hipaa.jpeg',
    github: '#',
    demo: '#',
  },
  {
    id: 'coming1',
    title: 'Coming Soon',
    subtitle: 'Future Project',
    description: 'Something exciting is in the works. Check back soon for updates on this upcoming project.',
    stack: ['TBD'],
    emoji: '🚀',
    colorFrom: 'from-violet-500/20',
    colorTo: 'to-purple-500/15',
    github: '#',
    demo: '#',
    placeholder: true,
  },
  {
    id: 'coming2',
    title: 'Coming Soon',
    subtitle: 'Future Project',
    description: 'Another project in development. Stay tuned for more details.',
    stack: ['TBD'],
    emoji: '⚡',
    colorFrom: 'from-amber-500/20',
    colorTo: 'to-orange-500/15',
    github: '#',
    demo: '#',
    placeholder: true,
  },
  {
    id: 'coming3',
    title: 'Coming Soon',
    subtitle: 'Future Project',
    description: 'More innovative work on the horizon. Follow along to see what comes next.',
    stack: ['TBD'],
    emoji: '🌟',
    colorFrom: 'from-cyan-500/20',
    colorTo: 'to-sky-500/15',
    github: '#',
    demo: '#',
    placeholder: true,
  },
];

function Badge({ text }) {
  return (
    <span className="px-3 py-[5px] text-[12px] rounded-md font-mono font-semibold
      bg-accent-soft
      text-accent
      border border-line-strong
      tracking-tight">
      {text}
    </span>
  );
}

function PlaceholderImg({ emoji, image, label }) {
  if (image) {
    return (
      <div className="relative w-full h-44 overflow-hidden border-b border-line">
        <img src={image} alt={label || ''} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="relative w-full h-44 flex items-center justify-center overflow-hidden
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
      <span className="relative text-6xl" role="img">{emoji}</span>
    </div>
  );
}

function ProjectCard({ project, idx }) {
  return (
    <div
      className={`glass-card border border-line flex-shrink-0
        w-80 md:w-[22rem]
        hover:border-line-strong hover:-translate-y-1
        transition-all duration-300 overflow-hidden rounded-2xl
        ${project.placeholder ? 'opacity-55' : ''}
        reveal reveal-delay-${(idx % 3) + 1}`}
    >
      <PlaceholderImg emoji={project.emoji} image={project.image} label={project.title} />
      <div className="p-6">
        <div className="mb-3.5">
          {/* Subtitle now ABOVE the title — pro pattern: eyebrow → headline */}
          <p className="text-[12px] font-mono text-accent mb-1.5 tracking-[0.18em] uppercase font-bold">
            {project.subtitle}
          </p>
          <h3 className="font-display font-bold text-[22px] text-ink tracking-tight leading-[1.15]">{project.title}</h3>
        </div>
        <p className="text-[15px] text-ink-2 leading-relaxed mb-5 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.stack.map(t => <Badge key={t} text={t} />)}
        </div>
        {!project.placeholder && (
          <div className="flex gap-5 pt-4 border-t border-line">
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-[14px] font-semibold text-ink
                hover:text-accent transition-colors">
              <FaGithub size={15} /> GitHub
            </a>
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-[14px] font-semibold text-ink
                hover:text-accent transition-colors">
              <FaExternalLinkAlt size={13} /> Live Demo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [showAll, setShowAll] = useState(false);
  const headerRef = useReveal();

  const mobileProjects = showAll ? ALL_PROJECTS : ALL_PROJECTS.slice(0, 3);

  // Desktop horizontal scroll
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const onScroll = () => {
      if (window.innerWidth < 768) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewH = window.innerHeight;
      if (rect.top > viewH || rect.bottom < 0) return;

      const scrollable = sectionHeight - viewH;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth + 128);
      track.style.transform = `translateX(-${progress * maxTranslate}px)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Trigger reveal on desktop cards too
  useEffect(() => {
    const cards = document.querySelectorAll('#projects .reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { rootMargin: '-20px', threshold: 0.05 }
    );
    cards.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, [showAll]);

  return (
    <section id="projects" className="bg-bg">

      {/* Header */}
      <div className="py-24 px-6">
        <div ref={headerRef} className="reveal max-w-6xl mx-auto text-center">
          <p className="font-mono text-accent text-[12px] mb-4 tracking-[0.25em] uppercase font-semibold">What I've Built</p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-5 tracking-tight">
            Projects
          </h2>
          <div className="mx-auto w-16 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent) 50%, transparent)' }} />
          <p className="mt-6 text-[13px] font-mono text-ink-2 hidden md:block tracking-wide font-medium">
            ← scroll to pan through projects →
          </p>
        </div>
      </div>

      {/* Desktop — sticky horizontal scroll */}
      <div ref={sectionRef} className="hidden md:block relative" style={{ height: '450vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <div
            ref={trackRef}
            className="horizontal-track"
            style={{ willChange: 'transform' }}
          >
            {ALL_PROJECTS.map((p, i) => (
              <ProjectCard key={p.id} project={p} idx={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile — vertical */}
      <div className="md:hidden px-6 pb-16">
        <div className="flex flex-col gap-6 max-w-sm mx-auto">
          {mobileProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} idx={i} />
          ))}
        </div>

        {!showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 rounded-xl font-display text-[14px] font-semibold tracking-wide
                border border-line-strong text-ink
                hover:bg-accent-soft hover:border-accent hover:text-accent
                transition-all duration-300 hover:scale-[1.03]"
            >
              Show All Projects
            </button>
          </div>
        )}
      </div>

    </section>
  );
}
