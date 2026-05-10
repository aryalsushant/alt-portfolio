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
          ? 'bg-bg/85 backdrop-blur-xl border-b border-line shadow-soft dark:shadow-soft-dark'
          : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo('home')}
          className="font-orbitron font-black text-[22px] tracking-[0.18em] group"
        >
          <span className="text-ink">SA</span>
          <span className="text-accent group-hover:opacity-70 transition-opacity">.</span>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`
                relative px-4 py-2 text-[14px] font-medium rounded-lg transition-all duration-200
                ${activeSection === link.id
                  ? 'text-accent'
                  : 'text-ink-2 hover:text-ink'}
              `}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
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
            className="relative w-14 h-7 rounded-full transition-all duration-300 bg-accent-soft border border-line-strong"
          >
            <span
              className={`
                absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center
                transition-all duration-300 shadow-sm bg-accent text-on-accent
                ${darkMode ? 'left-7' : 'left-0.5'}
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
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold
              border border-line-strong
              text-ink
              hover:bg-accent-soft hover:border-accent hover:text-accent
              transition-all duration-200 font-display tracking-wide"
          >
            Résumé
          </a>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg text-ink-2 hover:text-ink transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-line bg-bg/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`
                  text-left px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200
                  ${activeSection === link.id
                    ? 'bg-accent-soft text-accent'
                    : 'text-ink hover:bg-accent-soft/40'}
                `}
              >
                {link.label}
              </button>
            ))}
            <a
              href="/Sushant_Aryal_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-3 rounded-lg text-[14px] font-semibold text-center
                border border-line-strong text-ink
                hover:bg-accent-soft hover:border-accent hover:text-accent
                transition-all duration-200"
            >
              Résumé
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
