import React, { useEffect, useState, useCallback } from 'react';

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'education', label: 'Education' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'coolthings', label: 'Cool Things' },
  { id: 'contact', label: 'Contact' },
];

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  const onScroll = useCallback(() => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? window.scrollY / docHeight : 0;
    setProgress(Math.min(1, Math.max(0, scrolled)));

    // Determine active section
    const midY = window.innerHeight * 0.45;
    let active = 'home';
    for (const sec of SECTIONS) {
      const el = document.getElementById(sec.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= midY) active = sec.id;
      }
    }
    setActiveSection(active);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-center">
      {/* Track */}
      <div className="relative flex flex-col items-center" style={{ height: SECTIONS.length * 40 }}>
        {/* Background track line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10 dark:bg-white/10 bg-black/10" />

        {/* Filled track line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-px bg-gradient-to-b from-cyan-400 to-indigo-500 transition-all duration-150"
          style={{ height: `${progress * 100}%` }}
        />

        {/* Section dots */}
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className="relative z-10 flex items-center justify-center w-10 h-10 group"
              title={sec.label}
            >
              {/* Dot */}
              <div
                className={`
                  rounded-full transition-all duration-300
                  ${isActive
                    ? 'w-3 h-3 bg-cyan-400 dark:bg-cyan-400 bg-indigo-600 shadow-neon'
                    : 'w-2 h-2 bg-white/20 dark:bg-white/20 bg-black/20 group-hover:bg-cyan-400 dark:group-hover:bg-cyan-400 group-hover:bg-indigo-400'}
                `}
              />
              {/* Label tooltip */}
              <span
                className={`
                  absolute right-7 text-xs font-mono whitespace-nowrap px-2 py-0.5 rounded
                  pointer-events-none
                  transition-all duration-200
                  ${isActive
                    ? 'opacity-100 text-cyan-400 dark:text-cyan-400 text-indigo-600'
                    : 'opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-400 text-gray-500'}
                `}
              >
                {sec.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
