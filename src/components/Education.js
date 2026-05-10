import React, { useEffect, useRef } from 'react';

function useReveal(rootMargin = '-80px') {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); } },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);
  return ref;
}

function EduCard({ emoji, institution, degree, sub, dates, gpa, detail, delay }) {
  const ref = useReveal();
  const isImage = typeof emoji === 'string' && emoji.startsWith('/');
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay}`}>
      <div className="glass-card p-8 transition-all duration-300
        hover:border-line-strong hover:-translate-y-0.5
        border border-line">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Icon — emoji OR logo chip (white bg so institutional marks stay legible in both modes) */}
          <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden border border-line-strong
            ${isImage ? 'bg-white p-2' : 'bg-accent-soft text-3xl'}`}>
            {isImage ? (
              <img src={emoji} alt={`${institution} logo`} className="w-full h-full object-contain" />
            ) : (
              emoji
            )}
          </div>
          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 className="font-display font-bold text-xl md:text-[22px] text-ink leading-tight">{institution}</h3>
              <span className="text-[11px] font-mono text-accent bg-accent-soft
                border border-line-strong px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto tracking-wider uppercase font-semibold">
                {dates}
              </span>
            </div>
            <p className="font-display font-semibold text-ink mb-1.5 text-[16px]">{degree}</p>
            {sub && <p className="text-[15px] text-ink-2 mb-2 font-medium">{sub}</p>}
            {gpa && (
              <p className="text-[14px] font-mono text-accent mb-3 font-semibold">
                GPA <span className="font-bold tabular-nums">{gpa}</span>
              </p>
            )}
            {detail && <p className="text-[15px] text-ink-2 leading-relaxed">{detail}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Education() {
  const headerRef = useReveal();

  return (
    <section className="py-28 px-6 bg-bg-soft">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-accent text-[12px] mb-4 tracking-[0.25em] uppercase font-semibold">Background</p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-5 tracking-tight">
            Education
          </h2>
          <div className="mx-auto w-16 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent) 50%, transparent)' }} />
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          <EduCard
            emoji="/usmlogo.svg"
            institution="University of Southern Mississippi"
            degree="B.S. Computer Science"
            sub="Minor in Economic Data Analysis"
            dates="Expected May 2027"
            gpa="4.0"
            detail="Honors Scholar · President's List · Academic Excellence Scholar"
            delay={1}
          />
          <EduCard
            emoji="/cornell.png"
            institution="Cornell University"
            degree="Machine Learning Foundations"
            sub="BreakThroughTech AI Program"
            dates="Summer 2025"
            detail="Intensive coursework in ML theory and applied AI with Cornell faculty mentorship."
            delay={2}
          />
        </div>

      </div>
    </section>
  );
}
