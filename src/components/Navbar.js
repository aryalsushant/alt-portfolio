import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const navLinks = [
  { name: 'Home', to: 'home' },
  { name: 'About', to: 'about' },
  { name: 'Projects', to: 'projects' },
  { name: 'Contact', to: 'contact' },
];

const Navbar = ({ darkMode, setDarkMode }) => {
  const [active, setActive] = useState('home');

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
    document.getElementById(to).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/20 dark:bg-black/30 shadow-lg border-b border-white/10 dark:border-white/20 transition-colors duration-500">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="text-2xl font-bold tracking-widest text-cyan-400 drop-shadow-glow select-none">
          SUSHANT
        </div>
        <ul className="flex gap-6 text-lg">
          {navLinks.map(link => (
            <li key={link.to}>
              <button
                className={`relative px-2 py-1 font-semibold transition text-white dark:text-cyan-100 hover:text-cyan-400 focus:outline-none ${active === link.to ? 'after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-1 after:bg-cyan-400 after:rounded-full after:shadow-neon' : ''}`}
                onClick={() => handleClick(link.to)}
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode(dm => !dm)}
          className="ml-4 p-2 rounded-full bg-white/20 dark:bg-black/30 shadow-neon hover:shadow-glow transition-all duration-300"
        >
          {darkMode ? <FaSun className="text-yellow-300 text-xl" /> : <FaMoon className="text-cyan-400 text-xl" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 