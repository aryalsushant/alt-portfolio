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
    colorFrom: 'from-rose-500/30',
    colorTo: 'to-pink-500/20',
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
    colorFrom: 'from-blue-500/30',
    colorTo: 'to-indigo-500/20',
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
    colorFrom: 'from-emerald-500/30',
    colorTo: 'to-teal-500/20',
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
    <span className="px-2.5 py-1 text-xs rounded-full font-mono
      bg-indigo-50 dark:bg-white/5
      text-indigo-600 dark:text-cyan-400/80
      border border-indigo-200 dark:border-white/10">
      {text}
    </span>
  );
}

function PlaceholderImg({ emoji, colorFrom, colorTo }) {
  return (
    <div className={`w-full h-44 flex items-center justify-center text-6xl
      bg-gradient-to-br ${colorFrom} ${colorTo}
      border-b border-white/10`}>
      <span role="img">{emoji}</span>
    </div>
  );
}

function ProjectCard({ project, idx }) {
  return (
    <div
      className={`glass-card border border-gray-200/80 dark:border-white/5 flex-shrink-0
        w-80 md:w-[22rem]
        hover:border-indigo-400/30 dark:hover:border-cyan-400/30
        hover:scale-[1.02] hover:-translate-y-1
        transition-all duration-300 overflow-hidden rounded-2xl
        ${project.placeholder ? 'opacity-55' : ''}
        reveal reveal-delay-${(idx % 3) + 1}`}
    >
      <PlaceholderImg emoji={project.emoji} colorFrom={project.colorFrom} colorTo={project.colorTo} />
      <div className="p-6">
        <div className="mb-2">
          <h3 className="font-display font-bold text-gray-900 dark:text-white">{project.title}</h3>
          <p className="text-xs font-mono text-indigo-600 dark:text-cyan-400 mt-0.5">{project.subtitle}</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.stack.map(t => <Badge key={t} text={t} />)}
        </div>
        {!project.placeholder && (
          <div className="flex gap-4 pt-3 border-t border-gray-100 dark:border-white/5">
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400
                hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
              <FaGithub size={13} /> GitHub
            </a>
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400
                hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
              <FaExternalLinkAlt size={11} /> Live Demo
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
    <section id="projects" className="bg-white dark:bg-[#070b14]">

      {/* Header */}
      <div className="py-20 px-6">
        <div ref={headerRef} className="reveal max-w-6xl mx-auto text-center">
          <p className="font-mono text-indigo-600 dark:text-cyan-400 text-sm mb-3 tracking-widest uppercase">What I've Built</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-5">
            Projects
          </h2>
          <div className="mx-auto w-20 h-1 bg-gradient-to-r from-indigo-600 to-transparent dark:from-cyan-400 dark:to-transparent rounded-full" />
          <p className="mt-4 text-sm font-mono text-gray-400 dark:text-gray-500 hidden md:block">
            ← Scroll down to pan through projects →
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
              className="px-8 py-3 rounded-xl font-display text-sm font-bold tracking-wider
                border-2 border-indigo-600 dark:border-cyan-400
                text-indigo-600 dark:text-cyan-400
                hover:bg-indigo-50 dark:hover:bg-cyan-400/10
                transition-all duration-300 hover:scale-105"
            >
              Show All Projects
            </button>
          </div>
        )}
      </div>

    </section>
  );
}
