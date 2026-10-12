import React from 'react';
import { Link } from 'react-router-dom';
import './interactive.css';
import { PROFILE, EXPERIENCE, PROJECTS, EDUCATION, AWARDS, RESEARCH, SKILLS, CONTACT } from './content';

// Shown when WebGL is unavailable or the game crashes: same content,
// same visual language, zero 3D.
export default function StaticFallback({ reason }) {
  return (
    <div className="gx-static">
      <header>
        <p className="gx-eyebrow">{reason === 'crash' ? 'The game hit a snag — here’s the scroll version' : 'Your browser can’t run the 3D game — here’s the scroll version'}</p>
        <h1 className="gx-logo gx-logo--sm">
          <span>SUSHANT</span> <span className="gx-logo-2">ARYAL</span>
        </h1>
        <p className="gx-lead">{PROFILE.blurb}</p>
        <nav>
          <Link className="gx-btn" to="/classic">Classic portfolio</Link>
          <Link className="gx-btn gx-btn--ghost" to="/">Home</Link>
        </nav>
      </header>

      <section>
        <h2>Experience</h2>
        {EXPERIENCE.map(e => (
          <article key={e.id} style={{ '--accent': e.color }}>
            <h3>{e.title} · <span>{e.company}</span></h3>
            <p className="gx-meta">{e.dates} · {e.location}</p>
            <ul className="gx-bullets">{e.bullets.map(b => <li key={b}>{b}</li>)}</ul>
          </article>
        ))}
      </section>

      <section>
        <h2>Projects</h2>
        <div className="gx-static-grid">
          {PROJECTS.map(p => (
            <article key={p.id} style={{ '--accent': p.color }}>
              <h3>{p.name}</h3>
              <p className="gx-sub">{p.tagline}</p>
              <p>{p.desc}</p>
              <div className="gx-chips">{p.stack.map(s => <span key={s} className="gx-chip">{s}</span>)}</div>
              <div className="gx-actions">
                {p.links.map(l => (
                  <a key={l.href} className="gx-btn gx-btn--ghost" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Research</h2>
        <article>
          <h3>{RESEARCH.title}</h3>
          <p className="gx-meta">{RESEARCH.authors.join(', ')} · {RESEARCH.venue} · {RESEARCH.date}</p>
          <a className="gx-btn gx-btn--ghost" href={RESEARCH.href} target="_blank" rel="noopener noreferrer">arXiv ↗</a>
        </article>
      </section>

      <section>
        <h2>Education</h2>
        {EDUCATION.map(e => (
          <article key={e.id}>
            <h3>{e.school}</h3>
            <p className="gx-sub">{e.degree} · {e.sub}</p>
            <p className="gx-meta">{e.dates} · {e.detail}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>Skills</h2>
        {SKILLS.map(g => (
          <div key={g.id} style={{ marginBottom: 12 }}>
            <h3 style={{ color: g.color }}>{g.group}</h3>
            <div className="gx-chips">{g.items.map(s => <span key={s} className="gx-chip">{s}</span>)}</div>
          </div>
        ))}
      </section>

      <section>
        <h2>Awards</h2>
        <ul className="gx-awards">
          {AWARDS.map(a => (
            <li key={a.id}>
              <span className="gx-medal">{['', '🥇', '🥈', '🥉'][a.place]}</span>
              <div><strong>{a.title}</strong><span>{a.event}</span></div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Contact</h2>
        <div className="gx-actions">
          <a className="gx-btn" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a className="gx-btn gx-btn--ghost" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a className="gx-btn gx-btn--ghost" href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </section>
    </div>
  );
}
