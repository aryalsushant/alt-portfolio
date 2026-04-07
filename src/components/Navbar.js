import React, { useState, useEffect, useCallback } from 'react';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'education', label: 'Education' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'coolthings', label: 'Cool Things' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 30);
    const midY = window.innerHeight * 0.4;
    let active = 'home';
    for (const link of NAV_LINKS) {
      const el = document.getElementById(link.id);
      if (el && el.getBoundingClientRect().top <= midY) active = link.id;
    }
    setActiveSection(active);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-40 transition-all duration-500
        ${scrolled
          ? 'bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30 border-b border-gray-200/50 dark:border-white/5'
          : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo('home')}
          className="font-orbitron font-black text-xl tracking-widest group"
        >
          <span className="text-gray-900 dark:text-white">SA</span>
          <span className="text-indigo-600 dark:text-cyan-400 group-hover:opacity-70 transition-opacity">.</span>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`
                relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${activeSection === link.id
                  ? 'text-indigo-600 dark:text-cyan-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}
              `}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-cyan-400" />
              )}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
            className={`
              relative w-14 h-7 rounded-full transition-all duration-300
              ${darkMode
                ? 'bg-cyan-400/20 border border-cyan-400/40'
                : 'bg-indigo-100 border border-indigo-300'}
            `}
          >
            <span
              className={`
                absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center
                text-xs transition-all duration-300 shadow-sm
                ${darkMode
                  ? 'left-7 bg-cyan-400 text-black'
                  : 'left-0.5 bg-indigo-600 text-white'}
              `}
            >
              {darkMode ? <FaMoon size={10} /> : <FaSun size={10} />}
            </span>
          </button>

          {/* Resume Link */}
          <a
            href="/Sushant_Aryal_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
              border border-indigo-600/40 dark:border-cyan-400/40
              text-indigo-600 dark:text-cyan-400
              hover:bg-indigo-50 dark:hover:bg-cyan-400/10
              transition-all duration-200 font-orbitron tracking-wide"
          >
            Résumé
          </a>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200/50 dark:border-white/5 bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`
                  text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeSection === link.id
                    ? 'bg-indigo-50 dark:bg-cyan-400/10 text-indigo-600 dark:text-cyan-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}
                `}
              >
                {link.label}
              </button>
            ))}
            <a
              href="/Sushant_Aryal_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-3 rounded-lg text-sm font-medium text-center
                border border-indigo-600/40 dark:border-cyan-400/40
                text-indigo-600 dark:text-cyan-400
                hover:bg-indigo-50 dark:hover:bg-cyan-400/10 transition-all duration-200"
            >
              Résumé
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
