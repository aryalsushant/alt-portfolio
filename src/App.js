import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Education from './components/Education';
import Highlights from './components/Highlights';
import Experience from './components/Experience';
import Projects from './components/Projects';
import CoolThings from './components/CoolThings';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import ProgressBar from './components/ProgressBar';

function App() {
  // Dark mode state — preserve existing logic exactly
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Smooth scroll polyfill for Safari/IE
  useEffect(() => {
    if ('scrollBehavior' in document.documentElement.style === false) {
      import('smoothscroll-polyfill').then(mod => mod.polyfill());
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark' : ''}`}>
      {/* Global UI overlays */}
      <CursorGlow />
      <ProgressBar />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Page sections */}
      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="education">
          <Education />
        </section>

        <section id="highlights">
          <Highlights />
        </section>

        <section id="experience">
          <Experience />
        </section>

        <section id="projects">
          <Projects />
        </section>

        <section id="coolthings">
          <CoolThings />
        </section>

        <section id="contact">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
