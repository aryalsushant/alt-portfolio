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
  return (
    <div ref={ref} className={`reveal reveal-delay-${delay}`}>
      <div className="glass-card p-8 hover:scale-[1.01] transition-all duration-300
        hover:border-indigo-400/30 dark:hover:border-cyan-400/30
        border border-gray-200/80 dark:border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Icon */}
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
            bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-cyan-400/10 dark:to-indigo-400/10
            border border-indigo-200 dark:border-cyan-400/20">
            {emoji}
          </div>
          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">{institution}</h3>
              <span className="text-xs font-mono text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-cyan-400/10
                border border-indigo-200 dark:border-cyan-400/20 px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
                {dates}
              </span>
            </div>
            <p className="font-display font-semibold text-gray-700 dark:text-gray-200 mb-0.5 text-base">{degree}</p>
            {sub && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{sub}</p>}
            {gpa && (
              <p className="text-sm font-mono text-indigo-600 dark:text-cyan-400 mb-3">
                GPA: <span className="font-bold">{gpa}</span>
              </p>
            )}
            {detail && <p className="text-sm text-gray-500 dark:text-gray-400">{detail}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Education() {
  const headerRef = useReveal();

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <p className="font-mono text-indigo-600 dark:text-cyan-400 text-sm mb-3 tracking-widest uppercase">Background</p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-5">
            Education
          </h2>
          <div className="mx-auto w-20 h-1 bg-gradient-to-r from-indigo-600 to-transparent dark:from-cyan-400 dark:to-transparent rounded-full" />
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          <EduCard
            emoji="🦅"
            institution="University of Southern Mississippi"
            degree="B.S. Computer Science"
            sub="Minor in Economic Data Analysis"
            dates="Expected May 2027"
            gpa="4.0"
            detail="Honors Scholar · President's List · Academic Excellence Scholar"
            delay={1}
          />
          <EduCard
            emoji="🌿"
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
