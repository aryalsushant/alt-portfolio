import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaArrowRight, FaExternalLinkAlt, FaMoon, FaSun } from 'react-icons/fa';
import useAppliedTheme from '../hooks/useAppliedTheme';

// Unlisted page for the CSC 424 capstone poster QR code.
// Not linked from anywhere on the site and kept out of search results.

const PROJECTS = [
  {
    number: '01',
    pillar: 'Innovation Project',
    name: 'Crewly',
    blurb:
      'Finds where neighboring utilities plan construction close together and prices what they would save by coordinating. Built at ShellHacks 2026 for the GridLock challenge, where it received an honorable mention.',
    links: [
      { label: 'Live app', href: 'https://crewly.miami' },
      { label: 'Repository', href: 'https://github.com/iviraa/crewly' },
      { label: 'Cost model PR #8', href: 'https://github.com/iviraa/crewly/pull/8' },
      { label: 'Solana bounties PR #40', href: 'https://github.com/iviraa/crewly/pull/40' },
    ],
  },
  {
    number: '02',
    pillar: 'Industry QA Engagement',
    name: 'Optimal Web, Optimal Answers LLC',
    blurb:
      'Requirements-based, oracle and negative testing of a meat procurement and formula optimization app on build 3.2.644. Found 5 bugs, 4 of them high severity. The partner system is private, so there are no public links.',
    links: [],
  },
  {
    number: '03',
    pillar: 'Open-Source Contribution',
    name: 'Backstage ADR plugin (CNCF)',
    blurb:
      'Fixed Architecture Decision Records failing to load from Bitbucket Server. Merged on November 25, 2026 and released in @backstage-community/plugin-adr-common 0.26.1.',
    links: [
      { label: 'Pull request #12062', href: 'https://github.com/backstage/community-plugins/pull/12062' },
      { label: 'Issue #8022', href: 'https://github.com/backstage/community-plugins/issues/8022' },
      { label: 'Release on npm', href: 'https://www.npmjs.com/package/@backstage-community/plugin-adr-common' },
    ],
  },
];

function useNoIndex() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    const created = !meta;
    if (created) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    const previous = meta.content;
    meta.content = 'noindex, nofollow';
    return () => {
      if (created) meta.remove();
      else meta.content = previous;
    };
  }, []);
}

export default function Csc424() {
  const [dark, setDark] = useAppliedTheme();
  useNoIndex();

  return (
    <div className="min-h-screen bg-bg text-ink transition-colors duration-500">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex justify-end">
          <button
            onClick={() => setDark(d => !d)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-2 hover:text-accent hover:bg-accent-soft transition-colors">
            {dark ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <header className="text-center mb-10">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase font-bold text-accent mb-3">
            CSC 424 Capstone, Fall 2026
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">Sushant Aryal</h1>
          <p className="text-ink-2 text-[15px] leading-relaxed">
            Computer Science, minor in Economic Data Analysis
            <br />
            The University of Southern Mississippi
          </p>
        </header>

        <Link
          to="/"
          className="group flex items-center justify-between gap-4 w-full rounded-2xl px-6 py-5 mb-10 bg-accent text-on-accent font-display font-bold text-lg shadow-accent-glow transition-transform hover:-translate-y-0.5">
          <span>See my full portfolio</span>
          <FaArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>

        <div className="flex flex-col gap-5">
          {PROJECTS.map(p => (
            <section
              key={p.number}
              className="rounded-2xl border border-line-strong bg-bg-soft px-5 sm:px-6 py-5 shadow-soft dark:shadow-soft-dark">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase font-bold text-accent mb-1">
                {p.number} · {p.pillar}
              </p>
              <h2 className="font-display font-bold text-xl leading-tight mb-2">{p.name}</h2>
              <p className="text-[14px] leading-relaxed text-ink-2">{p.blurb}</p>
              {p.links.length > 0 && (
                <div className="flex flex-col gap-2 mt-4">
                  {p.links.map(l => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-[14px] font-semibold text-ink hover:border-accent hover:text-accent transition-colors">
                      <span>{l.label}</span>
                      <FaExternalLinkAlt className="text-[11px] shrink-0 opacity-70" />
                    </a>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        <footer className="mt-10 flex items-center justify-center gap-3">
          <a
            href="https://www.linkedin.com/in/sushant-aryal/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-full border border-line-strong flex items-center justify-center text-ink-2 hover:text-accent hover:border-accent transition-colors">
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/aryalsushant"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-10 h-10 rounded-full border border-line-strong flex items-center justify-center text-ink-2 hover:text-accent hover:border-accent transition-colors">
            <FaGithub />
          </a>
        </footer>
      </div>
    </div>
  );
}
