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
    <section className="py-24 px-6 bg-white dark:bg-[#070b14]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-indigo-600 dark:text-cyan-400 text-sm mb-3 tracking-widest uppercase">Get In Touch</p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-5">
            Contact
          </h2>
          <div className="mx-auto w-20 h-1 bg-gradient-to-r from-indigo-600 to-transparent dark:from-cyan-400 dark:to-transparent rounded-full" />
          <p className="mt-5 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Open to opportunities, collaborations, and interesting conversations. Let's build something together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Info Panel */}
          <div ref={infoRef} className="reveal reveal-delay-1 lg:col-span-2 flex flex-col gap-6">
            <div className="glass-card p-8 border border-gray-200/80 dark:border-white/5 flex-1">
              <h3 className="font-orbitron font-bold text-gray-900 dark:text-white mb-6 text-lg">Let's Connect</h3>

              <a href="mailto:sushantaryal05@gmail.com"
                className="group flex items-center gap-4 p-4 rounded-xl mb-3
                  hover:bg-indigo-50 dark:hover:bg-white/5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center
                  bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-cyan-400
                  group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaEnvelope size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-0.5">Email</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate
                    group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                    sushantaryal05@gmail.com
                  </p>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/sushant-aryal/" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl mb-3
                  hover:bg-indigo-50 dark:hover:bg-white/5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center
                  bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-cyan-400
                  group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaLinkedin size={16} />
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-0.5">LinkedIn</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200
                    group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                    sushant-aryal
                  </p>
                </div>
              </a>

              <a href="https://github.com/aryalsushant" target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl
                  hover:bg-indigo-50 dark:hover:bg-white/5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center
                  bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-cyan-400
                  group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaGithub size={16} />
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-0.5">GitHub</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200
                    group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                    aryalsushant
                  </p>
                </div>
              </a>
            </div>

            <div className="glass-card p-5 border border-gray-200/80 dark:border-white/5 text-center">
              <p className="text-2xl mb-1">📍</p>
              <p className="font-mono text-sm text-gray-500 dark:text-gray-400">Hattiesburg, MS</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">University of Southern Mississippi</p>
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} className="reveal reveal-delay-2 lg:col-span-3">
            <div className="glass-card p-8 border border-gray-200/80 dark:border-white/5">
              {state.succeeded ? (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                  <div className="text-6xl">✅</div>
                  <h3 className="font-orbitron font-bold text-xl text-gray-900 dark:text-white">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400">Thanks for reaching out. I'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3 className="font-orbitron font-bold text-gray-900 dark:text-white text-lg mb-1">Send a Message</h3>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-mono text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl text-sm
                        bg-gray-50 dark:bg-white/5
                        border border-gray-200 dark:border-white/10
                        text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-600
                        focus:outline-none focus:border-indigo-400 dark:focus:border-cyan-400/60
                        transition-colors duration-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-mono text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl text-sm
                        bg-gray-50 dark:bg-white/5
                        border border-gray-200 dark:border-white/10
                        text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-600
                        focus:outline-none focus:border-indigo-400 dark:focus:border-cyan-400/60
                        transition-colors duration-200"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors}
                      className="text-xs text-red-500 mt-1" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-mono text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder="What's on your mind?"
                      className="w-full px-4 py-3 rounded-xl text-sm resize-none
                        bg-gray-50 dark:bg-white/5
                        border border-gray-200 dark:border-white/10
                        text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-600
                        focus:outline-none focus:border-indigo-400 dark:focus:border-cyan-400/60
                        transition-colors duration-200"
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors}
                      className="text-xs text-red-500 mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full py-4 rounded-xl font-orbitron text-sm font-bold tracking-wider
                      bg-indigo-600 dark:bg-cyan-400
                      text-white dark:text-black
                      hover:bg-indigo-500 dark:hover:bg-cyan-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-300 hover:scale-[1.02]"
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
