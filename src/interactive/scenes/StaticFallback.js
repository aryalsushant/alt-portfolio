import React from 'react';
import { Link } from 'react-router-dom';
import { ABOUT, SKILLS, EXPERIENCE, EDUCATION, PROJECTS, AWARDS, CONTACT } from '../content';
import ContactForm from './ContactForm';

// Plain vertical rendering of the same content — used for
// prefers-reduced-motion and the HUD "skip animation" button.
export default function StaticFallback() {
  return (
    <div className="ip-root">
      <div className="ip-static" style={{ maxWidth: 880, margin: '0 auto' }}>
        <p className="ip-eyebrow">Interactive portfolio · text mode</p>
        <h1>Sushant Aryal</h1>
        <p style={{ color: 'var(--ip-text-dim)', maxWidth: 640 }}>
          {ABOUT.title} — {ABOUT.blurb}
        </p>
        <p style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {ABOUT.tags.map(t => <span key={t} className="ip-chip">{t}</span>)}
          <span className="ip-chip" style={{ color: 'var(--ip-amber)' }}>😴 {ABOUT.ribbon}</span>
        </p>
        <Link className="ip-hud-link" to="/">← back home</Link>

        <h2>Skills</h2>
        {SKILLS.map(g => (
          <div className="ip-card" key={g.group}>
            <div className="ip-eyebrow" style={{ marginBottom: 8 }}>{g.group}</div>
            {g.items.map(sk => <span key={sk} className="ip-chip">{sk}</span>)}
          </div>
        ))}

        <h2>Experience</h2>
        {EXPERIENCE.map(job => (
          <div className="ip-card" key={job.company}>
            <b>{job.title}</b> · {job.company}
            <div className="ip-eyebrow" style={{ margin: '4px 0 8px' }}>{job.dates}</div>
            <ul style={{ margin: 0, paddingLeft: '1.2em', color: 'var(--ip-text-dim)', fontSize: 14, lineHeight: 1.6 }}>
              {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        ))}

        <h2>Education</h2>
        {EDUCATION.map(ed => (
          <div className="ip-card" key={ed.school}>
            <b>{ed.school}</b> — {ed.degree}, {ed.sub}
            <div className="ip-eyebrow" style={{ margin: '4px 0 8px' }}>{ed.dates}</div>
            <p style={{ margin: 0, color: 'var(--ip-text-dim)', fontSize: 14 }}>{ed.detail}</p>
          </div>
        ))}

        <h2>Projects</h2>
        {PROJECTS.map(p => (
          <div className="ip-card" key={p.name}>
            <b>{p.name}</b> · <span style={{ color: 'var(--ip-pink)' }}>{p.tagline}</span>
            <p style={{ margin: '6px 0 10px', color: 'var(--ip-text-dim)', fontSize: 14, lineHeight: 1.6 }}>{p.desc}</p>
            {p.stack.map(s => <span key={s} className="ip-chip">{s}</span>)}
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              {p.github && <a className="ip-btn" href={p.github} target="_blank" rel="noopener noreferrer">GITHUB ↗</a>}
              {p.demo && <a className="ip-btn" href={p.demo} target="_blank" rel="noopener noreferrer">DEMO ↗</a>}
            </div>
          </div>
        ))}

        <h2>Awards</h2>
        {AWARDS.map(a => (
          <div className="ip-card" key={a.event}>
            {a.medal} <b>{a.title}</b> — <span style={{ color: 'var(--ip-text-dim)' }}>{a.event}</span>
          </div>
        ))}

        <h2>Contact</h2>
        <div className="ip-card">
          <p style={{ marginTop: 0, color: 'var(--ip-text-dim)' }}>{CONTACT.blurb}</p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
