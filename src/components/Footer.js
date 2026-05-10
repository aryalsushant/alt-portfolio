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
    <footer className="border-t border-line bg-bg-soft">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">

        <div className="text-center sm:text-left">
          <p className="font-display font-black text-[19px] text-ink tracking-[0.18em]">
            SUSHANT ARYAL
          </p>
          <p className="text-[12px] font-mono text-ink-2 mt-1 tracking-wide font-medium">
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
              className="w-11 h-11 rounded-xl flex items-center justify-center
                bg-surface
                border border-line-strong
                text-ink
                hover:bg-accent hover:text-on-accent
                hover:border-accent
                hover:scale-110
                transition-all duration-200"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <p className="text-[12px] font-mono text-ink-2 text-center sm:text-right tracking-wide font-medium">
          Built with{' '}
          <span className="text-accent font-bold">React</span>
          {' '}+{' '}
          <span className="text-accent font-bold">Tailwind</span>
        </p>

      </div>
    </footer>
  );
}
