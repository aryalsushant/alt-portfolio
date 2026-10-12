import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';
import { useGame } from '../core/store';
import { award } from '../world/Gameplay';
import { sfx } from '../audio/sound';
import { closePanel, openPanel, travelToPanel } from './actions';
import { PROFILE, SKILLS, EXPERIENCE, PROJECTS, RESEARCH, EDUCATION, AWARDS, CONTACT } from '../../content';

const COLLECTIONS = {
  experience: EXPERIENCE,
  project: PROJECTS,
  education: EDUCATION,
};

const ACCENT = {
  howto: '#ffffff',
  about: '#8fd46b',
  skills: '#63e7de',
  experience: '#ffb454',
  project: '#ff7ac8',
  research: '#9d8cff',
  education: '#ffc72c',
  awards: '#ffd166',
  contact: '#7db8ff',
};

const EYEBROW = {
  howto: 'Field manual',
  about: 'Player profile',
  skills: 'Skill tree',
  experience: 'Career log',
  project: 'Project arcade',
  research: 'Research',
  education: 'Academy',
  awards: 'Trophy room',
  contact: 'Signal tower',
};

function ExtLink({ href, children, className = 'gx-btn' }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={() => sfx.click()}>
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function HowTo() {
  const touch = useGame(s => s.touch);
  const rows = touch
    ? [
        ['Left thumb', 'Move (floating joystick)'],
        ['Drag right side', 'Look around · pinch to zoom'],
        ['⤒ button', 'Jump — tap again in the air to double jump'],
        ['⇢ button', 'Dash (works in the air too)'],
        ['Tap a landmark', 'Open it — walking up to one shows a preview card'],
        ['Action button', 'Read / interact when it appears'],
      ]
    : [
        ['W A S D / Arrows', 'Move'],
        ['Space', 'Jump — again in the air to double jump; hold for higher'],
        ['Shift', 'Dash (once per jump in the air)'],
        ['Walk up / click', 'Open any landmark in the sidebar'],
        ['E / Enter', 'Toggle the sidebar for what you’re standing at'],
        ['Mouse drag · Wheel', 'Orbit camera · zoom'],
        ['M / Tab', 'World map & fast travel'],
        ['Esc', 'Pause menu'],
        ['N', 'Mute'],
        ['Gamepad', 'Supported — A jump, X dash, Y interact'],
      ];
  return (
    <>
      <h2>How to play</h2>
      <p className="gx-lead">Every island holds a piece of Sushant’s story. Walk up to glowing things to read them, collect data shards, and find the Trophy Summit.</p>
      <dl className="gx-keys">
        {rows.map(([k, v]) => (
          <React.Fragment key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </React.Fragment>
        ))}
      </dl>
      <p className="gx-fine">Tip: fell off? The robot respawns at the last safe ledge. In a hurry? Open the map and fast travel anywhere.</p>
    </>
  );
}

function About() {
  return (
    <>
      <h2>{PROFILE.name}</h2>
      <p className="gx-sub">{PROFILE.role} · {PROFILE.location}</p>
      <p className="gx-lead">{PROFILE.blurb}</p>
      <div className="gx-stats">
        {PROFILE.stats.map(s => (
          <div key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <h3>Focus</h3>
      <div className="gx-chips">
        {PROFILE.focus.map(f => (
          <span key={f} className="gx-chip">{f}</span>
        ))}
      </div>
      <h3>Status</h3>
      <p className="gx-ribbon">😌 {PROFILE.ribbon} <small>— stress levels: unmeasurable</small></p>
      <div className="gx-actions">
        <ExtLink href={CONTACT.linkedin}>LinkedIn</ExtLink>
        <ExtLink href={CONTACT.github}>GitHub</ExtLink>
      </div>
    </>
  );
}

function Skills({ id }) {
  return (
    <>
      <h2>Skill crystals</h2>
      <p className="gx-lead">The toolkit, grouped by what it powers.</p>
      {SKILLS.map(g => (
        <section key={g.id} className={`gx-skill-group ${g.id === id ? 'is-active' : ''}`} style={{ '--c': g.color }}>
          <h3>{g.group}</h3>
          <div className="gx-chips">
            {g.items.map(s => (
              <span key={s} className="gx-chip">{s}</span>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function Experience({ item: e }) {
  return (
    <>
      <h2>{e.title}</h2>
      <p className="gx-sub" style={{ color: e.color }}>{e.company}</p>
      <p className="gx-meta">{e.dates} · {e.location}</p>
      <ul className="gx-bullets">
        {e.bullets.map(b => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </>
  );
}

function Project({ item: p }) {
  return (
    <>
      {p.image && (
        <div className="gx-shot">
          <img src={p.image} alt={`${p.name} screenshot`} loading="lazy" />
        </div>
      )}
      <h2>{p.name}</h2>
      <p className="gx-sub" style={{ color: p.color }}>{p.tagline}</p>
      <p className="gx-meta">{p.dates}</p>
      <p className="gx-lead">{p.desc}</p>
      <div className="gx-chips">
        {p.stack.map(s => (
          <span key={s} className="gx-chip">{s}</span>
        ))}
      </div>
      {p.links.length > 0 ? (
        <div className="gx-actions">
          {p.links.map(l => (
            <ExtLink key={l.href} href={l.href}>{l.label}</ExtLink>
          ))}
        </div>
      ) : (
        <p className="gx-fine">Internal tool — source is private.</p>
      )}
    </>
  );
}

function Research() {
  return (
    <>
      <h2>{RESEARCH.title}</h2>
      <p className="gx-sub">
        {RESEARCH.authors.map((a, i) => (
          <React.Fragment key={a}>
            {a === 'S. Aryal' ? <strong className="gx-hl">{a}</strong> : a}
            {i < RESEARCH.authors.length - 1 ? ', ' : ''}
          </React.Fragment>
        ))}
      </p>
      <p className="gx-meta">{RESEARCH.venue} · {RESEARCH.date}</p>
      <p className="gx-lead">{RESEARCH.summary}</p>
      <div className="gx-actions">
        <ExtLink href={RESEARCH.href}>Read on arXiv</ExtLink>
      </div>
    </>
  );
}

function Education({ item: e }) {
  return (
    <>
      <div className="gx-edu-head">
        <img src={e.logo} alt="" />
        <div>
          <h2>{e.school}</h2>
          <p className="gx-sub" style={{ color: e.color }}>{e.degree}</p>
        </div>
      </div>
      <p className="gx-meta">{e.sub} · {e.dates} · {e.location}</p>
      <p className="gx-lead">{e.detail}</p>
    </>
  );
}

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

function Awards() {
  return (
    <>
      <h2>Trophy room</h2>
      <p className="gx-lead">Hackathons, pitch competitions and datathons.</p>
      <ul className="gx-awards">
        {AWARDS.map(a => (
          <li key={a.id}>
            <span className="gx-medal">{MEDALS[a.place]}</span>
            <div>
              <strong>{a.title}</strong>
              <span>{a.event}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function Contact() {
  const [state, handleSubmit] = useForm(CONTACT.formspreeId);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (state.succeeded) award('hello');
  }, [state.succeeded]);
  return (
    <>
      <h2>{CONTACT.heading}</h2>
      <p className="gx-lead">{CONTACT.blurb}</p>
      <div className="gx-actions">
        <button
          className="gx-btn"
          onClick={() => {
            navigator.clipboard?.writeText(CONTACT.email).then(() => setCopied(true), () => {});
            sfx.click();
          }}
        >
          {copied ? 'Copied ✓' : CONTACT.email}
        </button>
        <ExtLink href={CONTACT.linkedin}>LinkedIn</ExtLink>
        <ExtLink href={CONTACT.github}>GitHub</ExtLink>
      </div>
      {state.succeeded ? (
        <div className="gx-sent">
          <span>📡</span>
          <strong>Transmission received!</strong>
          <p>Thanks for reaching out — I’ll get back to you soon.</p>
        </div>
      ) : (
        <form className="gx-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" name="name" required autoComplete="name" />
          </label>
          <label>
            Email
            <input type="email" name="email" required autoComplete="email" />
          </label>
          <ValidationError prefix="Email" field="email" errors={state.errors} className="gx-error" />
          <label>
            Message
            <textarea name="message" required rows={4} />
          </label>
          <ValidationError prefix="Message" field="message" errors={state.errors} className="gx-error" />
          <button type="submit" className="gx-btn gx-btn--primary" disabled={state.submitting}>
            {state.submitting ? 'Transmitting…' : 'Transmit message'}
          </button>
        </form>
      )}
    </>
  );
}

function Body({ panel, item }) {
  switch (panel.type) {
    case 'howto':
      return <HowTo />;
    case 'about':
      return <About />;
    case 'skills':
      return <Skills id={panel.id} />;
    case 'experience':
      return <Experience item={item} />;
    case 'project':
      return <Project item={item} />;
    case 'research':
      return <Research />;
    case 'education':
      return <Education item={item} />;
    case 'awards':
      return <Awards />;
    case 'contact':
      return <Contact />;
    default:
      return null;
  }
}

export default function Panel({ panel }) {
  const list = COLLECTIONS[panel.type];
  const index = list ? Math.max(0, list.findIndex(x => x.id === panel.id)) : 0;
  const item = list ? list[index] : null;
  const accent = item?.color || ACCENT[panel.type];
  const ref = useRef(null);

  const touch = useGame(s => s.touch);

  // prev/next (and the pips) walk the robot over to that exhibit
  const goTo = target => travelToPanel({ type: panel.type, id: target.id });
  const go = dir => {
    if (!list) return;
    goTo(list[(index + dir + list.length) % list.length]);
  };

  useEffect(() => {
    ref.current?.scrollTo?.({ top: 0 });
  }, [panel.id]);

  const openedAt = useRef(performance.now());
  useEffect(() => {
    openedAt.current = performance.now();
  }, [panel.mode]);

  // phones: walking up to something shows a compact card; tap to read
  if (touch && panel.mode === 'auto') {
    const title = item ? item.name || item.title || item.school : EYEBROW[panel.type];
    const sub = item ? item.company || item.tagline || item.degree : 'Tap to read';
    return (
      <motion.button
        className="gx-peek"
        style={{ '--accent': accent }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        onClick={() => openPanel(panel, 'open')}
      >
        <span className="gx-panel-eyebrow">{EYEBROW[panel.type]}</span>
        <strong>{title}</strong>
        <small>{sub} · tap to read ↑</small>
      </motion.button>
    );
  }

  return (
    <>
      {touch && (
        <motion.div
          className="gx-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // ignore the ghost click from the same tap that opened the sheet
          onClick={() => performance.now() - openedAt.current > 450 && closePanel()}
        />
      )}
      <motion.aside
        className="gx-panel"
        role="complementary"
        aria-label={EYEBROW[panel.type]}
        style={{ '--accent': accent }}
        initial={{ opacity: 0, x: 60, y: 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 60 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        <header className="gx-panel-head">
          <span className="gx-panel-eyebrow">{EYEBROW[panel.type]}</span>
          {list && (
            <span className="gx-panel-count">
              {index + 1} / {list.length}
            </span>
          )}
          <button className="gx-close" onClick={closePanel} aria-label="Close">
            ✕
          </button>
        </header>
        <div className="gx-panel-body" ref={ref} tabIndex={-1}>
          <motion.div key={panel.id || panel.type} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            <Body panel={panel} item={item} />
          </motion.div>
        </div>
        {list && (
          <footer className="gx-panel-foot">
            <button className="gx-btn gx-btn--ghost" onClick={() => go(-1)}>
              ← Prev
            </button>
            <div className="gx-pips">
              {list.map((x, i) => (
                <button
                  key={x.id}
                  className={i === index ? 'is-on' : ''}
                  onClick={() => goTo(x)}
                  aria-label={x.name || x.company || x.school}
                />
              ))}
            </div>
            <button className="gx-btn gx-btn--ghost" onClick={() => go(1)}>
              Next →
            </button>
          </footer>
        )}
      </motion.aside>
    </>
  );
}
