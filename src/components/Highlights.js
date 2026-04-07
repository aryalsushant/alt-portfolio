import React, { useEffect, useRef, useState } from 'react';

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

function useCounter(target, duration = 1600, isFloat = false, suffix = '') {
  const [val, setVal] = useState(isFloat ? '0.0' : '0');
  const triggerRef = useRef(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || fired.current) return;
      fired.current = true;
      obs.disconnect();

      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        if (isFloat) {
          setVal((ease * target).toFixed(1));
        } else {
          setVal(Math.floor(ease * target).toLocaleString());
        }
        if (p < 1) requestAnimationFrame(step);
        else setVal(isFloat ? target.toFixed(1) : target.toLocaleString() + suffix);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, isFloat, suffix]);

  return [val, triggerRef];
}

function PlaceholderImage({ emoji, label, colorFrom, colorTo }) {
  return (
    <div className={`w-full h-44 rounded-xl flex flex-col items-center justify-center gap-2.5
      bg-gradient-to-br ${colorFrom} ${colorTo}
      border border-white/10`}>
      <span className="text-5xl" role="img" aria-label={label}>{emoji}</span>
      <span className="text-xs font-mono text-white/50 tracking-wider">Photo Coming Soon</span>
    </div>
  );
}

export default function Highlights() {
  const headerRef = useReveal();

  const [gpaVal, gpaRef] = useCounter(4.0, 1400, true);
  const [residentVal, residentRef] = useCounter(400, 1600, false, '+');
  const [appVal, appRef] = useCounter(3000, 1800, false, '+');

  const card1Ref = useReveal('-40px');
  const card2Ref = useReveal('-40px');
  const card3Ref = useReveal('-40px');

  return (
    <section className="py-24 px-6 bg-white dark:bg-[#070b14]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-indigo-600 dark:text-cyan-400 text-sm mb-3 tracking-widest uppercase">What I Bring</p>
          <h2 className="font-orbitron text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-5">
            Highlights
          </h2>
          <div className="mx-auto w-20 h-1 bg-gradient-to-r from-indigo-600 to-transparent dark:from-cyan-400 dark:to-transparent rounded-full" />
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* GPA Card */}
          <div ref={card1Ref} className="reveal reveal-delay-1">
            <div className="glass-card p-8 border border-gray-200/80 dark:border-white/5 h-full
              hover:border-indigo-400/40 dark:hover:border-cyan-400/30 transition-all duration-300
              flex flex-col items-center text-center">
              <div ref={gpaRef} className="font-orbitron text-6xl font-black mb-2
                text-indigo-600 dark:text-cyan-400"
                style={{ textShadow: '0 0 30px rgba(0,245,255,0.3)' }}>
                {gpaVal}
              </div>
              <p className="font-orbitron text-sm font-bold text-gray-900 dark:text-white mb-3 tracking-wide">GPA</p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {['Honors Scholar', "President's List", 'Academic Excellence Scholar'].map(a => (
                  <span key={a} className="text-xs px-2.5 py-1 rounded-full
                    bg-indigo-50 dark:bg-white/5
                    text-indigo-600 dark:text-gray-300
                    border border-indigo-200 dark:border-white/10">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SRA Card */}
          <div ref={card2Ref} className="reveal reveal-delay-2">
            <div className="glass-card border border-gray-200/80 dark:border-white/5 h-full
              hover:border-indigo-400/40 dark:hover:border-cyan-400/30 transition-all duration-300
              overflow-hidden">
              <PlaceholderImage emoji="🏫" label="Senior Resident Assistant" colorFrom="from-violet-500/30" colorTo="to-indigo-500/20" />
              <div className="p-6">
                <h3 className="font-orbitron font-bold text-gray-900 dark:text-white mb-1">Senior Resident Assistant</h3>
                <p className="text-xs font-mono text-indigo-600 dark:text-cyan-400 mb-3">
                  DA → RA → SRA · 2023–2025
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  Led a team of 12 RAs + 10 DAs supporting{' '}
                  <span ref={residentRef} className="font-bold text-indigo-600 dark:text-cyan-400">{residentVal}</span>
                  + residents across campus housing.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Promoted three times in two years.</p>
              </div>
            </div>
          </div>

          {/* BTT AI Fellow Card */}
          <div ref={card3Ref} className="reveal reveal-delay-3">
            <div className="glass-card border border-gray-200/80 dark:border-white/5 h-full
              hover:border-indigo-400/40 dark:hover:border-cyan-400/30 transition-all duration-300
              overflow-hidden">
              <PlaceholderImage emoji="🤖" label="Cornell Tech AI Fellow" colorFrom="from-cyan-500/30" colorTo="to-teal-500/20" />
              <div className="p-6">
                <h3 className="font-orbitron font-bold text-gray-900 dark:text-white mb-1">BreakThroughTech AI Fellow</h3>
                <p className="text-xs font-mono text-indigo-600 dark:text-cyan-400 mb-3">Cornell Tech · 12-month program</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                  Selected from{' '}
                  <span ref={appRef} className="font-bold text-indigo-600 dark:text-cyan-400">{appVal}</span>
                  + applicants. Cornell faculty instruction, industry mentorship, experiential learning.
                </p>
                <div className="flex items-center gap-2">
                  <span className="animate-ping w-1.5 h-1.5 rounded-full bg-cyan-400 dark:bg-cyan-400 bg-indigo-500 opacity-75" />
                  <span className="text-xs font-mono text-indigo-600 dark:text-cyan-400">Active Fellow</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
