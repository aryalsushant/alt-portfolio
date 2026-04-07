import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const SOCIAL = [
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sushant-aryal/',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    href: 'https://github.com/aryalsushant',
  },
  {
    icon: FaEnvelope,
    label: 'Email',
    href: 'mailto:sushantaryal05@gmail.com',
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200/60 dark:border-white/5 bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">

        <div className="text-center sm:text-left">
          <p className="font-display font-black text-lg text-gray-900 dark:text-white tracking-widest">
            SUSHANT ARYAL
          </p>
          <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">
            © {year} · All rights reserved
          </p>
        </div>

        <div className="flex items-center gap-3">
          {SOCIAL.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              aria-label={label}
              className="w-10 h-10 rounded-xl flex items-center justify-center
                bg-white dark:bg-white/5
                border border-gray-200 dark:border-white/10
                text-gray-500 dark:text-gray-400
                hover:text-indigo-600 dark:hover:text-cyan-400
                hover:border-indigo-400/60 dark:hover:border-cyan-400/50
                hover:scale-110
                transition-all duration-200"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>

        <p className="text-xs font-mono text-gray-400 dark:text-gray-600 text-center sm:text-right">
          Built with{' '}
          <span className="text-indigo-600 dark:text-cyan-400">React</span>
          {' '}+{' '}
          <span className="text-indigo-600 dark:text-cyan-400">Tailwind</span>
        </p>

      </div>
    </footer>
  );
}
