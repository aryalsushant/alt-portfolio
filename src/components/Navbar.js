import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { name: 'Home', to: 'home' },
  { name: 'About', to: 'about' },
  { name: 'Projects', to: 'projects' },
  { name: 'Contact', to: 'contact' },
];

const Navbar = ({ darkMode, setDarkMode }) => {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => document.getElementById(link.to));
      const scrollY = window.scrollY + 80;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && scrollY >= sections[i].offsetTop) {
          setActive(navLinks[i].to);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (to) => {
    setActive(to);
    setMenuOpen(false);
    document.getElementById(to).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white dark:bg-[#232526] shadow-lg border-b border-gray-200 dark:border-white/20 transition-colors duration-500">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="text-2xl font-bold tracking-widest text-cyan-500 dark:text-cyan-400 drop-shadow-glow select-none">
          SUSHANT
        </div>
        {/* Mobile dark mode toggle (left of hamburger) */}
        <div className="flex items-center md:hidden">
          <span className="mr-2"><FaMoon className={`text-xl ${darkMode ? 'text-cyan-400' : 'text-gray-400'}`} /></span>
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode(dm => !dm)}
            className="relative w-12 h-6 flex items-center bg-gray-100 dark:bg-black/30 rounded-full shadow-neon hover:shadow-glow transition-all duration-300 focus:outline-none"
            tabIndex={0}
          >
            <span
              className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-cyan-400 dark:bg-yellow-300 shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-0' : 'translate-x-6'}`}
            ></span>
            <span className="sr-only">Toggle dark mode</span>
          </button>
          <span className="ml-2"><FaSun className={`text-xl ${!darkMode ? 'text-yellow-400' : 'text-gray-400'}`} /></span>
        </div>
        {/* Desktop nav */}
        <ul className="hidden md:flex gap-6 text-lg">
          {navLinks.map(link => (
            <li key={link.to}>
              <button
                className={`relative px-2 py-1 font-semibold transition text-black dark:text-cyan-100 hover:text-cyan-500 dark:hover:text-cyan-400 focus:outline-none ${active === link.to ? 'after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-1 after:bg-cyan-400 after:rounded-full after:shadow-neon' : ''}`}
                onClick={() => handleClick(link.to)}
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>
        {/* Desktop dark mode toggle */}
        <div className="hidden md:flex items-center ml-4">
          <span className="mr-2"><FaMoon className={`text-xl ${darkMode ? 'text-cyan-400' : 'text-gray-400'}`} /></span>
          <button
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode(dm => !dm)}
            className="relative w-14 h-7 flex items-center bg-gray-100 dark:bg-black/30 rounded-full shadow-neon hover:shadow-glow transition-all duration-300 focus:outline-none"
            tabIndex={0}
          >
            <span
              className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-cyan-400 dark:bg-yellow-300 shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-0' : 'translate-x-7'}`}
            ></span>
            <span className="sr-only">Toggle dark mode</span>
          </button>
          <span className="ml-2"><FaSun className={`text-xl ${!darkMode ? 'text-yellow-400' : 'text-gray-400'}`} /></span>
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden ml-2 p-2 rounded-full bg-gray-100 dark:bg-black/30 text-cyan-400 focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen(m => !m)}
        >
          {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black/95 backdrop-blur-lg border-b border-cyan-400/20 shadow-lg animate-fade-in z-40">
          <ul className="flex flex-col items-center gap-4 py-6">
            {navLinks.map(link => (
              <li key={link.to}>
                <button
                  className={`block w-full text-lg font-semibold px-4 py-2 text-gray-900 dark:text-cyan-100 hover:text-cyan-500 focus:outline-none ${active === link.to ? 'border-b-2 border-cyan-400' : ''}`}
                  onClick={() => handleClick(link.to)}
                >
                  {link.name}
                </button>
              </li>
            ))}
            <li>
              <div className="flex items-center justify-center mt-2">
                <span className="mr-2"><FaMoon className={`text-xl ${darkMode ? 'text-cyan-400' : 'text-gray-400'}`} /></span>
                <button
                  aria-label="Toggle dark mode"
                  onClick={() => setDarkMode(dm => !dm)}
                  className="relative w-14 h-7 flex items-center bg-gray-100 dark:bg-black/30 rounded-full shadow-neon hover:shadow-glow transition-all duration-300 focus:outline-none"
                  tabIndex={0}
                >
                  <span
                    className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-cyan-400 dark:bg-yellow-300 shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-0' : 'translate-x-7'}`}
                  ></span>
                  <span className="sr-only">Toggle dark mode</span>
                </button>
                <span className="ml-2"><FaSun className={`text-xl ${!darkMode ? 'text-yellow-400' : 'text-gray-400'}`} /></span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 