import React, { useEffect, useRef, useState } from 'react';

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#▓░▒@$%&~';
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

function useGlitchText(texts, speed) {
  const [display, setDisplay] = useState('');
  const stateRef = useRef({ idx: 0, phase: 'scramble', charCount: 0, frameCount: 0 });

  useEffect(() => {
    const tick = () => {
      const s = stateRef.current;
      const target = texts[s.idx];

      if (s.phase === 'scramble') {
        const txt = target.split('').map(c =>
          c === ' ' ? ' ' : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join('');
        setDisplay(txt);
        s.frameCount++;
        if (s.frameCount >= 12) { s.phase = 'resolve'; s.charCount = 0; s.frameCount = 0; }

      } else if (s.phase === 'resolve') {
        const resolved = target.slice(0, s.charCount + 1);
        const rest = target.slice(s.charCount + 1).split('').map(c =>
          c === ' ' ? ' ' : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join('');
        setDisplay(resolved + rest);
        s.charCount++;
        if (s.charCount >= target.length) { setDisplay(target); s.phase = 'pause'; s.frameCount = 0; }

      } else if (s.phase === 'pause') {
        s.frameCount++;
        if (s.frameCount >= 52) { s.phase = 'delete'; s.charCount = target.length; }

      } else if (s.phase === 'delete') {
        s.charCount--;
        setDisplay(target.slice(0, s.charCount));
        if (s.charCount <= 0) {
          s.idx = (s.idx + 1) % texts.length;
          s.phase = 'scramble';
          s.frameCount = 0;
        }
      }
    };
    const interval = setInterval(tick, speed);
    return () => clearInterval(interval);
  }, [texts, speed]);

  return display;
}

export default function Hero() {
  const canvasRef = useRef(null);
  const displayText = useGlitchText(CYCLE_TEXTS, 48);

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
        ctx.font = `${p.size}px 'Courier New', monospace`;
        ctx.fillStyle = dark ? '#00F5FF' : '#4F46E5';
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-[#070b14]">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-[#070b14] to-transparent pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,245,255,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24 pb-20">

        {/* BreakThroughTech badge — impossible to miss */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-10 rounded-full
          border border-indigo-400/50 dark:border-cyan-400/50
          bg-indigo-50 dark:bg-[rgba(0,245,255,0.06)]
          text-indigo-700 dark:text-cyan-300
          font-mono text-sm font-medium
          animate-glow-pulse">
          <span className="text-xl" role="img" aria-label="graduation cap">🎓</span>
          <span className="font-semibold">BreakThroughTech AI Fellow @ Cornell Tech</span>
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 dark:bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 dark:bg-cyan-400" />
          </span>
        </div>

        {/* Main heading — glitch typewriter */}
        <h1 className="font-orbitron text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-none tracking-tight text-gray-900 dark:text-white"
          style={{ minHeight: '1.2em' }}>
          <span>{displayText || '\u00A0'}</span>
          <span className="terminal-cursor" aria-hidden="true" />
        </h1>

        {/* Sub copy */}
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-4 max-w-2xl mx-auto leading-relaxed">
          Building at the intersection of AI, software engineering, and real-world impact.
        </p>
        <p className="text-sm font-mono text-gray-400 dark:text-gray-500 mb-12">
          Hattiesburg, MS &nbsp;·&nbsp; GPA 4.0 &nbsp;·&nbsp; Expected Graduation May 2027
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="group w-full sm:w-auto px-8 py-4 rounded-xl font-orbitron text-sm font-bold tracking-wider
              bg-indigo-600 dark:bg-cyan-400
              text-white dark:text-black
              hover:bg-indigo-500 dark:hover:bg-cyan-300
              transition-all duration-300 hover:scale-105
              flex items-center justify-center gap-2"
          >
            View My Work
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group w-full sm:w-auto px-8 py-4 rounded-xl font-orbitron text-sm font-bold tracking-wider
              border-2 border-indigo-600 dark:border-cyan-400
              text-indigo-600 dark:text-cyan-400
              hover:bg-indigo-50 dark:hover:bg-cyan-400/10
              transition-all duration-300 hover:scale-105
              flex items-center justify-center gap-2"
          >
            Contact Me
          </button>
        </div>

        {/* Quick social links */}
        <div className="mt-12 flex items-center justify-center gap-6 text-xs font-mono text-gray-400 dark:text-gray-500">
          <a href="https://github.com/aryalsushant" target="_blank" rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
            github
          </a>
          <span>·</span>
          <a href="https://linkedin.com/in/sushant-aryal" target="_blank" rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
            linkedin
          </a>
          <span>·</span>
          <a href="mailto:sushantaryal05@gmail.com"
            className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
            email
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-[10px] font-mono tracking-widest text-gray-400 dark:text-gray-600 uppercase">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gray-400 dark:from-gray-600 to-transparent" />
      </div>
    </div>
  );
}
