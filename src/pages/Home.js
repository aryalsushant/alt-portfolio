import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaMoon, FaSun } from 'react-icons/fa';
import useAppliedTheme from '../hooks/useAppliedTheme';

// Self-contained banner art (kept out of the lazy game chunk on purpose).
function InteractiveArt() {
  const stars = Array.from({ length: 26 }, (_, i) => {
    const r = n => {
      const x = Math.sin(i * 57.3 + n) * 10000;
      return x - Math.floor(x);
    };
    return { left: r(1) * 100, top: r(2) * 55, d: r(3) * 3 };
  });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ background: 'linear-gradient(180deg, #0a0e28 0%, #1c2150 55%, #43285c 100%)' }}>
      {stars.map((s, i) => (
        <span key={i} className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`, top: `${s.top}%`, width: 2.5, height: 2.5,
            animation: `home-twinkle 3s ease-in-out ${s.d}s infinite`,
          }} />
      ))}
      {/* moon */}
      <div className="absolute rounded-full"
        style={{
          right: '12%', top: '14%', width: 46, height: 46,
          background: 'radial-gradient(circle at 60% 35%, #fdfbee, #cdc6e6)',
          boxShadow: '0 0 34px 8px rgba(220,214,255,.35)',
        }} />
      {/* skyline */}
      <svg className="absolute bottom-0 left-0 w-full" style={{ height: '52%' }}
        viewBox="0 0 1200 240" preserveAspectRatio="none">
        {Array.from({ length: 18 }, (_, i) => {
          const r = n => { const x = Math.sin(i * 91.7 + n) * 10000; return x - Math.floor(x); };
          const w = 46 + r(4) * 44, h = 70 + r(5) * 150, x = i * 68;
          return (
            <g key={i}>
              <rect x={x} y={240 - h} width={w} height={h} fill={i % 3 ? '#141936' : '#0f1430'} />
              {Array.from({ length: 5 }, (_, j) => (
                r(j + 8) > 0.4 && (
                  <rect key={j} x={x + 8 + (j % 2) * 18} y={240 - h + 14 + Math.floor(j / 2) * 30}
                    width={7} height={10} rx={1.5} fill="rgba(255,205,130,.85)" />
                )
              ))}
            </g>
          );
        })}
        {/* mountain + flag */}
        <path d="M880 240 L1030 60 L1090 60 L1200 240 Z" fill="#232a52" />
        <path d="M1030 60 L1090 60 L1104 86 L1072 76 L1042 92 L1016 78 Z" fill="#e7ebfa" opacity=".9" />
        <line x1="1058" y1="60" x2="1058" y2="30" stroke="#e7ebfa" strokeWidth="3" />
        <path d="M1058 30 L1082 38 L1058 46 Z" fill="#ffb454" />
      </svg>
      {/* tiny robot */}
      <svg className="absolute" style={{ left: '14%', bottom: '8%', width: 54, height: 74 }}
        viewBox="0 0 100 140">
        <line x1="50" y1="16" x2="50" y2="5" stroke="#8f99b4" strokeWidth="3" />
        <circle cx="50" cy="4" r="4.5" fill="#ffd166" />
        <rect x="14" y="56" width="12" height="34" rx="6" fill="#aab4cc" />
        <rect x="74" y="56" width="12" height="34" rx="6" fill="#aab4cc" />
        <rect x="34" y="96" width="11" height="26" rx="5" fill="#8f99b4" />
        <rect x="55" y="96" width="11" height="26" rx="5" fill="#8f99b4" />
        <rect x="28" y="50" width="44" height="50" rx="13" fill="#ff9d6b" />
        <circle cx="50" cy="70" r="6.5" fill="#ffd166" />
        <rect x="24" y="14" width="52" height="36" rx="16" fill="#e8ecf7" />
        <rect x="30" y="22" width="40" height="22" rx="10" fill="#1c2138" />
        <circle cx="42" cy="33" r="4.6" fill="#63e7de" />
        <circle cx="58" cy="33" r="4.6" fill="#63e7de" />
      </svg>
    </div>
  );
}

function ClassicArt() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-bg-soft">
      <div className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
      {/* abstract doc lines */}
      <div className="absolute left-[8%] top-[18%] flex flex-col gap-3 w-1/3 opacity-70">
        <div className="h-4 w-2/3 rounded bg-accent/60" />
        <div className="h-2.5 w-full rounded bg-line-strong" />
        <div className="h-2.5 w-5/6 rounded bg-line-strong" />
        <div className="h-2.5 w-4/6 rounded bg-line-strong" />
      </div>
      <div className="absolute right-[10%] bottom-[16%] grid grid-cols-2 gap-3 w-1/4 opacity-70">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-14 rounded-xl border border-line-strong bg-surface" />
        ))}
      </div>
    </div>
  );
}

function Banner({ art, eyebrow, title, blurb, cta, to, external }) {
  const inner = (
    <div className="group relative min-h-[44vh] flex items-center overflow-hidden rounded-3xl border border-line card-hover">
      {art}
      <div className="relative z-10 px-8 md:px-14 py-12 max-w-xl">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
          style={{ color: external ? undefined : '#f3f1ea' }}>
          {title}
        </h2>
        <p className="text-[15px] md:text-base leading-relaxed mb-7"
          style={{ color: external ? undefined : 'rgba(243,241,234,.75)' }}>
          {blurb}
        </p>
        <span className="inline-block font-mono text-[13px] font-bold tracking-[0.18em] uppercase
          px-6 py-3.5 rounded-xl bg-accent text-on-accent
          transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.02]">
          {cta}
        </span>
      </div>
    </div>
  );
  return <Link to={to} className="block">{inner}</Link>;
}

export default function Home() {
  const [dark, setDark] = useAppliedTheme();

  return (
    <div className="min-h-screen bg-bg text-ink transition-colors duration-500">
      <style>{`@keyframes home-twinkle { 0%,100% { opacity:.9 } 50% { opacity:.2 } }`}</style>

      {/* header */}
      <header className="max-w-6xl mx-auto px-6 py-7 flex items-center justify-between">
        <span className="font-orbitron font-bold tracking-[0.22em] text-lg md:text-xl">
          SUSHANT ARYAL
        </span>
        <div className="flex items-center gap-2">
          <a href="https://github.com/aryalsushant" target="_blank" rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-2 hover:text-accent hover:bg-accent-soft transition-colors">
            <FaGithub size={18} />
          </a>
          <a href="https://www.linkedin.com/in/sushant-aryal/" target="_blank" rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-2 hover:text-accent hover:bg-accent-soft transition-colors">
            <FaLinkedin size={18} />
          </a>
          <a href="mailto:sushantaryal05@gmail.com" aria-label="Email"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-2 hover:text-accent hover:bg-accent-soft transition-colors">
            <FaEnvelope size={17} />
          </a>
          <button onClick={() => setDark(!dark)} aria-label="Toggle theme"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-2 hover:text-accent hover:bg-accent-soft transition-colors">
            {dark ? <FaSun size={16} /> : <FaMoon size={15} />}
          </button>
        </div>
      </header>

      {/* intro */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-10 text-center">
        <p className="eyebrow justify-center mb-4">Choose your experience</p>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
          Two portfolios. Same person.
        </h1>
      </div>

      {/* banners */}
      <main className="max-w-6xl mx-auto px-6 pb-16 flex flex-col gap-8">
        <Banner
          art={<InteractiveArt />}
          eyebrow="▶ New Game"
          title="Interactive Portfolio"
          blurb="A scroll-driven adventure — walk a retro city, bungee off a bridge, catch a plane, climb a mountain. My work, playable."
          cta="Press Start →"
          to="/interactive"
        />
        <Banner
          art={<ClassicArt />}
          external
          eyebrow="📄 Speedrun"
          title="Classic Portfolio"
          blurb="The straightforward version. Everything in one scrollable page — no side quests, no falling off bridges."
          cta="View Portfolio →"
          to="/classic"
        />
      </main>

      <footer className="max-w-6xl mx-auto px-6 pb-10 text-center">
        <p className="font-mono text-[12px] text-ink-3 tracking-wide">
          © {new Date().getFullYear()} Sushant Aryal · Hattiesburg, MS
        </p>
      </footer>
    </div>
  );
}
