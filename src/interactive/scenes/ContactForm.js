import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { CONTACT } from '../content';

// Same Formspree backend as the classic portfolio's contact section.
export default function ContactForm({ compact = false }) {
  const [state, handleSubmit] = useForm(CONTACT.formspreeId);

  if (state.succeeded) {
    return (
      <div style={{ textAlign: 'center', padding: '4vh 0' }}>
        <div style={{ fontSize: 34 }}>✅</div>
        <p style={{ fontWeight: 700, margin: '1vh 0 0.5vh' }}>Message sent!</p>
        <p style={{ color: 'var(--ip-text-dim)', fontSize: 13, margin: 0 }}>
          Thanks for reaching out — I'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="ip-contact-form"
      style={{ display: 'flex', flexDirection: 'column', gap: compact ? '1.1vh' : '1.6vh' }}>
      <input type="text" name="name" required placeholder="Your name" aria-label="Name" />
      <input type="email" name="email" required placeholder="your@email.com" aria-label="Email" />
      <ValidationError prefix="Email" field="email" errors={state.errors} />
      <textarea name="message" required rows={compact ? 3 : 5} placeholder="What's on your mind?" aria-label="Message" />
      <ValidationError prefix="Message" field="message" errors={state.errors} />
      <button type="submit" className="ip-contact-submit" disabled={state.submitting}>
        {state.submitting ? 'SENDING…' : 'SEND MESSAGE →'}
      </button>
    </form>
  );
}
