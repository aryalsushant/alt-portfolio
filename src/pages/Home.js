import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaMoon, FaSun } from 'react-icons/fa';
import useAppliedTheme from '../hooks/useAppliedTheme';

// Self-contained banner art (kept out of the lazy game chunk on purpose).
function InteractiveArt() {
  // Mirrors the 3D game: sunset sky, floating islands, rope bridges, cloud sea.
  const stars = Array.from({ length: 22 }, (_, i) => {
    const r = n => {
      const x = Math.sin(i * 57.3 + n) * 10000;
      return x - Math.floor(x);
    };
    return { left: 30 + r(1) * 70, top: r(2) * 30, d: r(3) * 3 };
  });

  // low-poly floating island: grass cap + jagged rock underside
  const island = (cx, cy, w, grass, key) => {
    const h = w * 0.62;
    const rock = `M${cx - w / 2} ${cy}
      L${cx - w * 0.36} ${cy + h * 0.38} L${cx - w * 0.2} ${cy + h * 0.55}
      L${cx - w * 0.06} ${cy + h} L${cx + w * 0.1} ${cy + h * 0.62}
      L${cx + w * 0.26} ${cy + h * 0.5} L${cx + w * 0.42} ${cy + h * 0.26} L${cx + w / 2} ${cy} Z`;
    return (
      <g key={key}>
        <path d={rock} fill="#5b3f6e" />
        <path d={`M${cx - w * 0.06} ${cy + h} L${cx + w * 0.1} ${cy + h * 0.62} L${cx + w * 0.26} ${cy + h * 0.5} L${cx + w * 0.42} ${cy + h * 0.26} L${cx + w / 2} ${cy} Z`} fill="#3f2f63" />
        <path d={`M${cx - w / 2} ${cy} L${cx - w * 0.38} ${cy + h * 0.1} L${cx + w * 0.38} ${cy + h * 0.1} L${cx + w / 2} ${cy} Z`} fill="#b0703f" />
        <ellipse cx={cx} cy={cy} rx={w / 2} ry={w * 0.09} fill={grass} />
        <ellipse cx={cx - w * 0.08} cy={cy - w * 0.02} rx={w * 0.3} ry={w * 0.045} fill="#fff" opacity=".12" />
      </g>
    );
  };

  const tree = (x, y, s, c, key) => (
    <g key={key}>
      <rect x={x - 2 * s} y={y - 16 * s} width={4 * s} height={16 * s} fill="#7a4b38" />
      <polygon points={`${x},${y - 34 * s} ${x + 12 * s},${y - 20 * s} ${x + 7 * s},${y - 12 * s} ${x - 8 * s},${y - 12 * s} ${x - 12 * s},${y - 22 * s}`} fill={c} />
    </g>
  );

  const bridge = (x1, y1, x2, y2, key) => {
    const n = Math.max(6, Math.round(Math.hypot(x2 - x1, y2 - y1) / 9));
    return (
      <g key={key}>
        {Array.from({ length: n + 1 }, (_, i) => {
          const t = i / n;
          const x = x1 + (x2 - x1) * t;
          const y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 6;
          return <rect key={i} x={x - 3} y={y - 2} width={6} height={5} rx={1} fill="#a8714a" />;
        })}
        <path d={`M${x1} ${y1 - 9} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + 2} ${x2} ${y2 - 9}`} stroke="#e8d3a8" strokeWidth="1.2" fill="none" opacity=".9" />
      </g>
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ background: 'linear-gradient(180deg, #2b2a6b 0%, #5c3f8f 38%, #c4709b 68%, #ffb38a 100%)' }}>
      <style>{`
        @keyframes home-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
        @keyframes home-float-2 { 0%,100% { transform: translateY(0) } 50% { transform: translateY(6px) } }
        @keyframes home-drift { from { transform: translateX(0) } to { transform: translateX(-60px) } }
        @keyframes home-glint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
      `}</style>
      {stars.map((s, i) => (
        <span key={i} className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`, top: `${s.top}%`, width: 2, height: 2,
            animation: `home-twinkle 3s ease-in-out ${s.d}s infinite`,
          }} />
      ))}
      {/* low sun with glow */}
      <div className="absolute rounded-full"
        style={{
          right: '30%', bottom: '18%', width: 70, height: 70,
          background: 'radial-gradient(circle, #fff6dc 0%, #ffd9a0 45%, rgba(255,190,140,0) 72%)',
          boxShadow: '0 0 90px 40px rgba(255,190,140,.35)',
        }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 420" preserveAspectRatio="xMaxYMid slice">
        {/* far islands */}
        <g opacity=".55" style={{ animation: 'home-float-2 7s ease-in-out infinite' }}>
          {island(640, 130, 110, '#8fb07a', 'f1')}
          {island(1120, 92, 90, '#9bb07a', 'f2')}
        </g>

        {/* bridges */}
        {bridge(820, 236, 958, 182, 'b1')}
        {bridge(1052, 182, 1150, 132, 'b2')}

        {/* main island: robot + career boards */}
        <g style={{ animation: 'home-float 6s ease-in-out infinite' }}>
          {island(745, 246, 230, '#7ccf6a', 'main')}
          {tree(660, 240, 1.2, '#ff9ec7', 't1')}
          {tree(812, 236, 1, '#58b86b', 't2')}
          {/* boards */}
          {[['#ff5d73', 690], ['#9d8cff', 718], ['#63e7de', 772], ['#ffb454', 800]].map(([c, x], i) => (
            <g key={i}>
              <rect x={x} y={196 + (i % 2) * 4} width={20} height={36} rx={2.5} fill="#2b2747" />
              <rect x={x} y={196 + (i % 2) * 4} width={1.6} height={36} fill={c} />
              <rect x={x + 18.4} y={196 + (i % 2) * 4} width={1.6} height={36} fill={c} />
              <rect x={x + 4} y={203 + (i % 2) * 4} width={12} height={2} fill={c} opacity=".9" />
              <rect x={x + 5} y={209 + (i % 2) * 4} width={10} height={1.5} fill="#fff" opacity=".55" />
              <rect x={x + 5} y={213 + (i % 2) * 4} width={10} height={1.5} fill="#fff" opacity=".35" />
            </g>
          ))}
          {/* robot */}
          <g transform="translate(736 206) scale(.3)">
            <line x1="50" y1="16" x2="50" y2="5" stroke="#8f99b4" strokeWidth="4" />
            <circle cx="50" cy="4" r="6" fill="#ffd166" />
            <rect x="14" y="56" width="12" height="34" rx="6" fill="#aab4cc" />
            <rect x="74" y="56" width="12" height="34" rx="6" fill="#aab4cc" />
            <rect x="34" y="96" width="11" height="26" rx="5" fill="#8f99b4" />
            <rect x="55" y="96" width="11" height="26" rx="5" fill="#8f99b4" />
            <rect x="28" y="50" width="44" height="50" rx="13" fill="#ff8a52" />
            <circle cx="50" cy="70" r="6.5" fill="#ffd166" />
            <rect x="24" y="14" width="52" height="36" rx="16" fill="#eef1f8" />
            <rect x="30" y="22" width="40" height="22" rx="10" fill="#141a30" />
            <circle cx="42" cy="33" r="4.6" fill="#6ff7ee" />
            <circle cx="58" cy="33" r="4.6" fill="#6ff7ee" />
          </g>
          {/* data shard */}
          <polygon points="760,170 767,180 760,190 753,180" fill="#8ff6ff" style={{ animation: 'home-glint 2s ease-in-out infinite' }} />
        </g>

        {/* mid island: arcade + crystal */}
        <g style={{ animation: 'home-float-2 6.5s ease-in-out infinite' }}>
          {island(1004, 184, 120, '#5fbf8f', 'mid')}
          <polygon points="975,178 983,150 991,178" fill="#ff7ac8" opacity=".9" />
          <polygon points="985,178 992,160 999,178" fill="#ff9fd6" opacity=".85" />
          <rect x="1012" y="152" width="16" height="26" rx="2" fill="#1e1b38" />
          <rect x="1014" y="156" width="12" height="9" fill="#63e7de" opacity=".85" />
          {tree(1045, 180, 0.8, '#b48cff', 't3')}
        </g>

        {/* summit island: trophy + flag */}
        <g style={{ animation: 'home-float 8s ease-in-out infinite' }}>
          {island(1172, 128, 70, '#b8d86c', 'top')}
          <rect x="1160" y="112" width="18" height="14" fill="#f4efe6" />
          <path d="M1162 100 h14 l-2 8 q-5 5 -10 0 z" fill="#ffd166" />
          <rect x="1167" y="107" width="4" height="5" fill="#ffd166" />
          <line x1="1188" y1="126" x2="1188" y2="96" stroke="#e7ebfa" strokeWidth="2" />
          <path d="M1188 96 L1204 101 L1188 106 Z" fill="#ff8a52" />
        </g>

        {/* cloud sea */}
        <g style={{ animation: 'home-drift 18s linear infinite alternate' }}>
          {Array.from({ length: 14 }, (_, i) => (
            <ellipse key={i} cx={i * 100 + 20} cy={392 + (i % 3) * 8} rx={90 + (i % 4) * 18} ry={34 + (i % 3) * 8}
              fill={i % 2 ? '#ffd9c2' : '#f3bfc6'} opacity=".92" />
          ))}
        </g>
      </svg>

      {/* keep the copy legible: left fade on desktop, full wash on phones */}
      <div className="absolute inset-0 hidden md:block"
        style={{ background: 'linear-gradient(90deg, rgba(20,12,48,.82) 0%, rgba(20,12,48,.55) 38%, rgba(20,12,48,0) 62%)' }} />
      <div className="absolute inset-0 md:hidden"
        style={{ background: 'linear-gradient(180deg, rgba(20,12,48,.55) 0%, rgba(20,12,48,.78) 45%, rgba(20,12,48,.35) 100%)' }} />
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
        <p className="eyebrow justify-center mb-4">Hi, I'm Sushant</p>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
          Welcome to my website
        </h1>
      </div>

      {/* banners */}
      <main className="max-w-6xl mx-auto px-6 pb-16 flex flex-col gap-8">
        <Banner
          art={<InteractiveArt />}
          eyebrow="▶ New Game"
          title="Interactive Portfolio"
          blurb="A 3D game. Run, jump and dash a robot across floating islands, read my work off the landmarks, collect data shards and climb to the trophy summit. Works on phones too."
          cta="Press Start →"
          to="/interactive"
        />
        <Banner
          art={<ClassicArt />}
          external
          eyebrow="📄 Speedrun"
          title="Classic Portfolio"
          blurb="A classic, straightforward portfolio with no sidequests and no mountains."
          cta="View Portfolio →"
          to="/classic"
        />
      </main>

      <footer style={{ background: '#484848' }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
          {/* about */}
          <div>
            <h3 className="font-display text-lg font-extrabold tracking-[0.08em] uppercase text-white mb-6">
              About
            </h3>
            <div className="flex items-start gap-5">
              <div className="shrink-0 w-20 h-20 rounded-full flex items-end justify-center overflow-hidden"
                style={{ background: '#29b7d3' }}>
                <svg viewBox="0 0 100 140" style={{ width: 44, height: 62, marginBottom: -6 }}>
                  <line x1="50" y1="16" x2="50" y2="5" stroke="#8f99b4" strokeWidth="3" />
                  <circle cx="50" cy="4" r="4.5" fill="#ffd166" />
                  <rect x="14" y="56" width="12" height="34" rx="6" fill="#aab4cc" />
                  <rect x="74" y="56" width="12" height="34" rx="6" fill="#aab4cc" />
                  <rect x="28" y="50" width="44" height="50" rx="13" fill="#ff9d6b" />
                  <circle cx="50" cy="70" r="6.5" fill="#ffd166" />
                  <rect x="24" y="14" width="52" height="36" rx="16" fill="#e8ecf7" />
                  <rect x="30" y="22" width="40" height="22" rx="10" fill="#1c2138" />
                  <circle cx="42" cy="33" r="4.6" fill="#63e7de" />
                  <circle cx="58" cy="33" r="4.6" fill="#63e7de" />
                </svg>
              </div>
              <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,.82)' }}>
                Sushant Aryal is a Computer Science student specializing in AI Engineering.
                He has built and deployed multiple production level applications for personal
                projects, hackathons, as well as organizations. His speciality is finding
                creative solutions to boring engineering problems.
              </p>
            </div>
          </div>

          {/* contact */}
          <div>
            <h3 className="font-display text-lg font-extrabold tracking-[0.08em] uppercase text-white mb-6">
              Contact
            </h3>
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,.82)' }}>
              If you have any questions about me, or just want to say hello,
              feel free to contact me. Below are my social pages and my email:
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/aryalsushant" target="_blank" rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-transform hover:-translate-y-1"
                style={{ background: '#24292f' }}>
                <FaGithub size={20} />
              </a>
              <a href="https://www.linkedin.com/in/sushant-aryal/" target="_blank" rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-transform hover:-translate-y-1"
                style={{ background: '#2867b2' }}>
                <FaLinkedin size={20} />
              </a>
              <a href="mailto:sushantaryal05@gmail.com" aria-label="Email"
                className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-transform hover:-translate-y-1"
                style={{ background: '#f2a33c' }}>
                <FaEnvelope size={19} />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center pb-8">
          <p className="font-mono text-[12px] tracking-wide" style={{ color: 'rgba(255,255,255,.5)' }}>
            © {new Date().getFullYear()} Sushant Aryal
          </p>
        </div>
      </footer>
    </div>
  );
}
