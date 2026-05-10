import React, { useEffect, useRef } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

function useReveal(rootMargin = '-60px') {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return ref;
}

export default function Contact() {
  const [state, handleSubmit] = useForm('meokndpk');
  const headerRef = useReveal();
  const formRef = useReveal('-30px');
  const infoRef = useReveal('-30px');

  return (
    <section className="py-28 px-6 bg-bg">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-accent text-[12px] mb-4 tracking-[0.25em] uppercase font-semibold">Get In Touch</p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-5 tracking-tight">
            Contact
          </h2>
          <div className="mx-auto w-16 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent) 50%, transparent)' }} />
          <p className="mt-6 text-[15px] md:text-base text-ink-2 max-w-xl mx-auto leading-relaxed">
            Open to opportunities, collaborations, and interesting conversations. Let's build something together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Info Panel */}
          <div ref={infoRef} className="reveal reveal-delay-1 lg:col-span-2 flex flex-col gap-6">
            <div className="glass-card p-7 border border-line flex-1">
              <h3 className="font-display font-bold text-xl text-ink mb-6 tracking-tight">Let's Connect</h3>

              <a href="mailto:sushantaryal05@gmail.com"
                className="group flex items-center gap-4 p-3.5 rounded-xl mb-2
                  hover:bg-accent-soft transition-all duration-200">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center
                  bg-accent-soft text-accent border border-line-strong
                  group-hover:scale-110 group-hover:bg-accent group-hover:text-on-accent transition-all flex-shrink-0">
                  <FaEnvelope size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-mono text-accent mb-0.5 tracking-[0.18em] uppercase font-bold">Email</p>
                  <p className="text-[14px] font-semibold text-ink truncate
                    group-hover:text-accent transition-colors">
                    sushantaryal05@gmail.com
                  </p>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/sushant-aryal/" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 p-3.5 rounded-xl mb-2
                  hover:bg-accent-soft transition-all duration-200">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center
                  bg-accent-soft text-accent border border-line-strong
                  group-hover:scale-110 group-hover:bg-accent group-hover:text-on-accent transition-all flex-shrink-0">
                  <FaLinkedin size={17} />
                </div>
                <div>
                  <p className="text-[11px] font-mono text-accent mb-0.5 tracking-[0.18em] uppercase font-bold">LinkedIn</p>
                  <p className="text-[14px] font-semibold text-ink
                    group-hover:text-accent transition-colors">
                    sushant-aryal
                  </p>
                </div>
              </a>

              <a href="https://github.com/aryalsushant" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 p-3.5 rounded-xl
                  hover:bg-accent-soft transition-all duration-200">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center
                  bg-accent-soft text-accent border border-line-strong
                  group-hover:scale-110 group-hover:bg-accent group-hover:text-on-accent transition-all flex-shrink-0">
                  <FaGithub size={17} />
                </div>
                <div>
                  <p className="text-[11px] font-mono text-accent mb-0.5 tracking-[0.18em] uppercase font-bold">GitHub</p>
                  <p className="text-[14px] font-semibold text-ink
                    group-hover:text-accent transition-colors">
                    aryalsushant
                  </p>
                </div>
              </a>
            </div>

            <div className="glass-card p-5 border border-line text-center">
              <p className="text-2xl mb-1.5">📍</p>
              <p className="font-display font-bold text-[15px] text-ink">Hattiesburg, MS</p>
              <p className="text-[12px] text-ink-2 mt-1 font-mono tracking-wide font-medium">University of Southern Mississippi</p>
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} className="reveal reveal-delay-2 lg:col-span-3">
            <div className="glass-card p-8 border border-line">
              {state.succeeded ? (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                  <div className="text-6xl">✅</div>
                  <h3 className="font-display font-bold text-2xl text-ink tracking-tight">Message Sent!</h3>
                  <p className="text-[15px] text-ink-2">Thanks for reaching out. I'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3 className="font-display font-bold text-xl text-ink mb-2 tracking-tight">Send a Message</h3>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[11px] font-mono text-accent tracking-[0.2em] uppercase font-bold">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl text-[15px] font-medium
                        bg-bg-soft
                        border border-line-strong
                        text-ink
                        placeholder:text-ink-3 placeholder:font-normal
                        focus:outline-none focus:border-accent
                        focus:ring-2 focus:ring-accent/20
                        transition-all duration-200"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[11px] font-mono text-accent tracking-[0.2em] uppercase font-bold">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl text-[15px] font-medium
                        bg-bg-soft
                        border border-line-strong
                        text-ink
                        placeholder:text-ink-3 placeholder:font-normal
                        focus:outline-none focus:border-accent
                        focus:ring-2 focus:ring-accent/20
                        transition-all duration-200"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors}
                      className="text-xs text-red-500 mt-1" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-[11px] font-mono text-accent tracking-[0.2em] uppercase font-bold">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder="What's on your mind?"
                      className="w-full px-4 py-3 rounded-xl text-[15px] resize-none font-medium
                        bg-bg-soft
                        border border-line-strong
                        text-ink
                        placeholder:text-ink-3 placeholder:font-normal
                        focus:outline-none focus:border-accent
                        focus:ring-2 focus:ring-accent/20
                        transition-all duration-200 leading-relaxed"
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors}
                      className="text-xs text-red-500 mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full py-4 rounded-xl font-display text-[15px] font-semibold tracking-wide
                      bg-accent text-on-accent
                      hover:bg-accent-strong
                      shadow-[0_10px_30px_-10px_var(--accent)]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_14px_40px_-10px_var(--accent)]"
                  >
                    {state.submitting ? 'Sending...' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
