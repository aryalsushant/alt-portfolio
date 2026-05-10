import React, { useEffect, useRef, useState } from 'react';

const CYCLE_TEXTS = [
  'Sushant Aryal',
  'AI/ML Engineer',
  'CS @ USM',
  'Cornell Tech AI Fellow',
];
const CODE_FRAGMENTS = [
  'import torch', 'def forward(x):', 'model.fit(X_train, y)', 'loss.backward()',
  '∇f(x) = 0', 'O(n log n)', 'async function fetch()', 'useState(null)',
  'SELECT * FROM users', 'precision: 0.943', 'epochs=100', 'batch_size=32',
  'return F.softmax(x)', 'np.random.seed(42)', 'pd.DataFrame(data)',
  'torch.nn.Linear(512,256)', 'optimizer.step()', 'docker build -t app .',
  'git push origin main', 'const reduce = arr =>', '#!/usr/bin/env python3',
  'sigmoid(z)', 'kernel_size=(3,3)', 'activation="relu"', 'dropout=0.2',
  'x = np.linspace(0, 1)', 'import pandas as pd', 'class Model(nn.Module):',
  'kubectl apply -f', 'aws s3 sync', 'pip install transformers',
  'attention_mask', 'embedding_dim=512', 'cross_entropy_loss',
];

function useTypewriter(texts, typeSpeed = 80, deleteSpeed = 45, pauseFrames = 42) {
  const [display, setDisplay] = useState('');
  const stateRef = useRef({ idx: 0, phase: 'type', charCount: 0, frameCount: 0 });

  useEffect(() => {
    const tick = () => {
      const s = stateRef.current;
      const target = texts[s.idx];

      if (s.phase === 'type') {
        s.charCount++;
        setDisplay(target.slice(0, s.charCount));
        if (s.charCount >= target.length) { s.phase = 'pause'; s.frameCount = 0; }

      } else if (s.phase === 'pause') {
        s.frameCount++;
        if (s.frameCount >= pauseFrames) { s.phase = 'delete'; }

      } else if (s.phase === 'delete') {
        s.charCount--;
        setDisplay(target.slice(0, s.charCount));
        if (s.charCount <= 0) {
          s.idx = (s.idx + 1) % texts.length;
          s.phase = 'type';
        }
      }
    };

    // Use different intervals for type vs delete for a natural feel
    const speed = stateRef.current.phase === 'delete' ? deleteSpeed : typeSpeed;
    const interval = setInterval(tick, speed);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts, typeSpeed, deleteSpeed, pauseFrames]);

  return display;
}

export default function Hero() {
  const canvasRef = useRef(null);
  const displayText = useTypewriter(CYCLE_TEXTS);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 10 : 28;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: -(0.12 + Math.random() * 0.35),
      drift: (Math.random() - 0.5) * 0.06,
      opacity: 0.05 + Math.random() * 0.15,
      size: 9 + Math.random() * 5,
      text: CODE_FRAGMENTS[Math.floor(Math.random() * CODE_FRAGMENTS.length)],
    }));

    let animId;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const dark = document.documentElement.classList.contains('dark');

      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px 'JetBrains Mono', 'Courier New', monospace`;
        ctx.fillStyle = dark ? '#CFFFE2' : '#25343F';
        ctx.fillText(p.text, p.x, p.y);
        p.y += p.vy;
        p.x += p.drift;
        if (p.y < -30 || p.x < -200 || p.x > w + 200) {
          p.y = h + 30;
          p.x = Math.random() * w;
          p.text = CODE_FRAGMENTS[Math.floor(Math.random() * CODE_FRAGMENTS.length)];
          p.opacity = 0.05 + Math.random() * 0.15;
        }
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg to-transparent pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, var(--accent-soft) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24 pb-20">

        {/* BreakThroughTech badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-10 rounded-full
          border border-accent/50
          bg-accent-soft
          text-accent
          font-mono text-[13px] sm:text-sm font-medium
          animate-glow-pulse">
          <span className="text-lg" role="img" aria-label="graduation cap">🎓</span>
          <span className="font-semibold tracking-tight">BreakThroughTech AI Fellow @ Cornell Tech</span>
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
        </div>

        {/* Main heading — typewriter */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-[1.05] tracking-tight text-ink"
          style={{ minHeight: '1.2em' }}>
          <span>{displayText || '\u00A0'}</span>
          <span className="terminal-cursor" aria-hidden="true" />
        </h1>

        {/* Sub copy — primary message: large + ink-2 (78% contrast, not faded grey) */}
        <p className="text-lg md:text-xl text-ink-2 mb-7 max-w-2xl mx-auto leading-relaxed">
          Building at the intersection of AI, software engineering, and real-world impact.
        </p>

        {/* Meta line — pill row, full ink contrast, structured pro pattern */}
        <div className="mb-14 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-[14px] md:text-[15px] font-medium text-ink">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            Hattiesburg, MS
          </span>
          <span className="text-ink-3 select-none mx-1">·</span>
          <span className="inline-flex items-baseline gap-1.5">
            <span className="font-mono text-accent font-semibold uppercase tracking-wider text-[12px]">GPA</span>
            <span className="font-mono tabular-nums font-bold">4.0</span>
          </span>
          <span className="text-ink-3 select-none mx-1">·</span>
          <span className="inline-flex items-baseline gap-1.5">
            <span className="font-mono text-accent font-semibold uppercase tracking-wider text-[12px]">Grad</span>
            <span className="font-mono tabular-nums">May 2027</span>
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="group w-full sm:w-auto px-8 py-4 rounded-xl font-display text-[15px] font-semibold tracking-wide
              bg-accent text-on-accent
              hover:bg-accent-strong
              shadow-[0_10px_30px_-10px_var(--accent)]
              transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_14px_40px_-10px_var(--accent)]
              flex items-center justify-center gap-2"
          >
            View My Work
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group w-full sm:w-auto px-8 py-4 rounded-xl font-display text-[15px] font-semibold tracking-wide
              border border-line-strong
              text-ink
              hover:border-accent hover:text-accent hover:bg-accent-soft
              transition-all duration-300 hover:scale-[1.03]
              flex items-center justify-center gap-2"
          >
            Contact Me
          </button>
        </div>

        {/* Social links — semibold ink (full contrast), dot accent, no fading */}
        <div className="mt-14 flex items-center justify-center gap-5 sm:gap-6 text-[14px] font-semibold text-ink">
          <a href="https://github.com/aryalsushant" target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 hover:text-accent transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform" />
            GitHub
          </a>
          <span className="text-ink-3 select-none">/</span>
          <a href="https://linkedin.com/in/sushant-aryal" target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 hover:text-accent transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform" />
            LinkedIn
          </a>
          <span className="text-ink-3 select-none">/</span>
          <a href="mailto:sushantaryal05@gmail.com"
            className="group inline-flex items-center gap-2 hover:text-accent transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform" />
            Email
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5">
        <span className="text-[11px] font-mono tracking-[0.3em] text-ink-3 uppercase font-semibold">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </div>
  );
}
