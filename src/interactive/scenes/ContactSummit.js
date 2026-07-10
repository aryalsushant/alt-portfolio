import React from 'react';
import SceneBox from './SceneBox';
import { CONTACT } from '../content';
import ContactForm from './ContactForm';

// The final scene: a big postcard standing on the summit plateau.
// The robot hops off the peak and naps on its top edge.
export default function ContactSummit() {
  return (
    // sits right of the First Prize flag (banner ends ~1528) so it never covers it
    <SceneBox x={1529} w={34} y={-114} z={10}>
      <div className="ip-card" style={{ padding: '2.4vh 1.8vw' }}>
        <p className="ip-eyebrow" style={{ margin: '0 0 0.8vh' }}>Final level cleared · Summit reached</p>
        <h2 style={{ margin: '0 0 0.6vh', fontSize: 'clamp(18px, 1.8vw, 26px)', fontWeight: 800 }}>
          {CONTACT.heading}
        </h2>
        <p style={{ margin: '0 0 1.6vh', color: 'var(--ip-text-dim)', fontSize: 'clamp(12px, 1vw, 14px)' }}>
          {CONTACT.blurb}
        </p>
        <ContactForm compact />
        <div style={{ display: 'flex', gap: '1.2vw', marginTop: '1.6vh', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5 }}>
          <a className="ip-hud-link" href={`mailto:${CONTACT.email}`}>EMAIL</a>
          <a className="ip-hud-link" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a className="ip-hud-link" href={CONTACT.github} target="_blank" rel="noopener noreferrer">GITHUB</a>
        </div>
      </div>
    </SceneBox>
  );
}
