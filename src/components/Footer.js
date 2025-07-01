import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => (
  <footer className="w-full py-6 bg-white/10 dark:bg-black/30 border-t border-cyan-400/20 text-center mt-12">
    <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6 gap-4">
      <div className="text-cyan-200 text-sm">&copy; {new Date().getFullYear()} Sushant Aryal. All rights reserved.</div>
      <div className="flex gap-6 justify-center">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-white transition drop-shadow-neon hover:drop-shadow-glow text-xl"><FaLinkedin /></a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-white transition drop-shadow-neon hover:drop-shadow-glow text-xl"><FaGithub /></a>
        <a href="mailto:someone@email.com" className="text-cyan-400 hover:text-white transition drop-shadow-neon hover:drop-shadow-glow text-xl"><FaEnvelope /></a>
      </div>
    </div>
  </footer>
);

export default Footer; 