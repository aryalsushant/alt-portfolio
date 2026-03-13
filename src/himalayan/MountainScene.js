import React from 'react';

/**
 * Layered Himalayan mountain background.
 *
 * Accepts an optional `pathType` prop ('education' | 'work' | 'projects' | null).
 * Each path has a distinct sky palette, mountain/hill tones, trail shape, and
 * trail colour so the three routes feel meaningfully different.
 */

// ─── Per-path visual themes ───────────────────────────────────────────────────
const THEMES = {
  // Base camp view — default warm palette
  default: {
    sky: `linear-gradient(to bottom,
      #0a1628 0%, #122040 12%, #1a3d6b 28%,
      #2e6fa0 45%, #5b9bc4 62%, #9cc4d8 74%,
      #cde3eb 83%, #e8dfd0 90%, #dfc9a0 100%)`,
    farPeaks:  '#b8ccd8',
    snow:      '#eef3f7',
    midRidge:  '#3d6b88',
    nearHills: '#285242',
    ground:    '#1a2e1e',
  },

  // Education — cold, clear, high-altitude academic blue
  education: {
    sky: `linear-gradient(to bottom,
      #08101e 0%, #0e1a32 12%, #162e58 28%,
      #245e94 45%, #4285b0 62%, #7aaec8 74%,
      #b4d0de 83%, #d8d8cc 90%, #c8b888 100%)`,
    farPeaks:  '#aec4d4',
    snow:      '#f0f4f8',
    midRidge:  '#2e5c78',
    nearHills: '#224434',
    ground:    '#14201a',
  },

  // Work — warm amber dawn, ambitious, well-trodden
  work: {
    sky: `linear-gradient(to bottom,
      #0a1018 0%, #161e28 12%, #1e3040 28%,
      #345060 45%, #4e7080 62%, #7a9ca8 74%,
      #b0beb8 83%, #d4c8a8 90%, #c89850 100%)`,
    farPeaks:  '#bcc4bc',
    snow:      '#f0f0ec',
    midRidge:  '#445e6c',
    nearHills: '#2c4420',
    ground:    '#182010',
  },

  // Projects — vibrant teal-green, lush, creative wilderness
  projects: {
    sky: `linear-gradient(to bottom,
      #081418 0%, #0c1e30 12%, #163448 28%,
      #245e6a 45%, #348080 62%, #52a098 74%,
      #88c4b4 83%, #b8d8c0 90%, #a8c478 100%)`,
    farPeaks:  '#aec4c0',
    snow:      '#ecf4f0',
    midRidge:  '#2a6268',
    nearHills: '#1a4c28',
    ground:    '#0e1e14',
  },
};

// ─── Trail geometry per path ──────────────────────────────────────────────────
function Trail({ pathType = 'default' }) {
  if (pathType === 'education') {
    // Narrow rocky path — stone steps
    return (
      <g>
        {/* Rocky trail fill */}
        <path
          d="M 715,150 C 714,130 715,108 718,90 L 720,83 L 722,83 C 725,108 726,130 725,150 Z"
          fill="#9a8870"
          opacity="0.85"
        />
        {/* Stone step lines */}
        {[140, 126, 112, 100, 91].map((y, i) => (
          <line
            key={i}
            x1={715 + i * 0.4}  y1={y}
            x2={725 - i * 0.4}  y2={y}
            stroke="rgba(160,140,110,0.55)"
            strokeWidth="1.2"
          />
        ))}
        {/* Edge highlights */}
        <path d="M 715,150 C 714,130 715,108 718,90" stroke="rgba(200,180,150,0.3)" strokeWidth="1" fill="none" />
        <path d="M 725,150 C 726,130 725,108 722,90" stroke="rgba(200,180,150,0.3)" strokeWidth="1" fill="none" />
        {/* Rocky side boulders */}
        <ellipse cx="710" cy="128" rx="5" ry="3" fill="rgba(180,160,130,0.35)" />
        <ellipse cx="730" cy="112" rx="4" ry="2.5" fill="rgba(180,160,130,0.3)" />
        <ellipse cx="709" cy="98"  rx="4" ry="2.5" fill="rgba(180,160,130,0.28)" />
      </g>
    );
  }

  if (pathType === 'work') {
    // Wide worn dirt road — amber-brown, dual ruts
    return (
      <g>
        {/* Wide trail base */}
        <path
          d="M 706,150 C 704,122 707,98 714,86 L 720,80 L 726,86 C 733,98 736,122 734,150 Z"
          fill="#8a6030"
          opacity="0.80"
        />
        {/* Left rut */}
        <path
          d="M 709,150 C 708,126 710,102 716,90"
          stroke="rgba(100,68,28,0.5)"
          strokeWidth="2"
          fill="none"
        />
        {/* Right rut */}
        <path
          d="M 731,150 C 730,126 730,102 724,90"
          stroke="rgba(100,68,28,0.5)"
          strokeWidth="2"
          fill="none"
        />
        {/* Edge shading */}
        <path d="M 706,150 C 704,122 707,98 714,86" stroke="rgba(180,120,60,0.3)" strokeWidth="1" fill="none" />
        <path d="M 734,150 C 736,122 733,98 726,86" stroke="rgba(180,120,60,0.3)" strokeWidth="1" fill="none" />
        {/* Worn dust patches */}
        <ellipse cx="720" cy="136" rx="8" ry="3" fill="rgba(160,120,70,0.25)" />
        <ellipse cx="720" cy="112" rx="6" ry="2.5" fill="rgba(160,120,70,0.2)" />
        <ellipse cx="720" cy="92"  rx="5" ry="2" fill="rgba(160,120,70,0.18)" />
      </g>
    );
  }

  if (pathType === 'projects') {
    // Wide organic wilderness path — green-brown, living edges
    return (
      <g>
        {/* Wide organic trail */}
        <path
          d="M 703,150 C 698,116 705,92 713,81 L 720,77 L 727,81 C 735,92 742,116 737,150 Z"
          fill="#627840"
          opacity="0.78"
        />
        {/* Left green-grass edge strip */}
        <path
          d="M 703,150 C 698,116 705,92 713,81 L 714,85 C 707,95 702,118 707,150 Z"
          fill="rgba(80,120,48,0.5)"
        />
        {/* Right green-grass edge strip */}
        <path
          d="M 737,150 C 742,116 735,92 727,81 L 726,85 C 733,95 738,118 733,150 Z"
          fill="rgba(80,120,48,0.5)"
        />
        {/* Center dirt stripe */}
        <path
          d="M 717,150 C 716,120 718,96 720,84 C 722,96 724,120 723,150 Z"
          fill="rgba(140,110,60,0.35)"
        />
        {/* Small fern tufts beside the path */}
        <ellipse cx="698" cy="130" rx="5" ry="2.5" fill="rgba(80,130,60,0.5)" />
        <ellipse cx="743" cy="118" rx="4" ry="2"   fill="rgba(80,130,60,0.45)" />
        <ellipse cx="697" cy="105" rx="4" ry="2"   fill="rgba(80,130,60,0.4)" />
        <ellipse cx="744" cy="96"  rx="3.5" ry="2" fill="rgba(80,130,60,0.38)" />
      </g>
    );
  }

  // Default — simple dirt trail (used for base camp)
  return (
    <g>
      <path
        d="M 708,150 C 706,132 708,112 716,92 L 720,80 L 724,80 C 732,92 734,112 732,150 Z"
        fill="#7a6048"
        opacity="0.75"
      />
      <path d="M 720,80 C 714,92 710,112 708,150" stroke="rgba(180,150,100,0.3)" strokeWidth="1" fill="none" />
      <path d="M 720,80 C 726,92 730,112 732,150" stroke="rgba(180,150,100,0.3)" strokeWidth="1" fill="none" />
    </g>
  );
}

// ─── Cloud component ──────────────────────────────────────────────────────────
function Cloud({ cx, cy, scale = 1, opacity = 0.13 }) {
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`} opacity={opacity}>
      <ellipse cx="0"   cy="0"   rx="80" ry="28" fill="white" />
      <ellipse cx="-40" cy="8"   rx="50" ry="22" fill="white" />
      <ellipse cx="42"  cy="8"   rx="55" ry="24" fill="white" />
      <ellipse cx="-10" cy="-10" rx="38" ry="20" fill="white" />
    </g>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MountainScene({ pathType = null }) {
  const theme = THEMES[pathType] || THEMES.default;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ background: theme.sky }}
    >
      {/* ── Clouds ──────────────────────────────────────────────────────────── */}
      <svg
        className="absolute w-full"
        style={{ top: '8%', height: '22%' }}
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Cloud cx={160}  cy={60} scale={0.9} opacity={0.10} />
        <Cloud cx={480}  cy={35} scale={1.1} opacity={0.13} />
        <Cloud cx={820}  cy={55} scale={0.75} opacity={0.09} />
        <Cloud cx={1100} cy={30} scale={1.0} opacity={0.12} />
        <Cloud cx={1340} cy={65} scale={0.85} opacity={0.08} />
      </svg>

      {/* ── Layer 1: Distant snow-capped peaks ──────────────────────────────── */}
      <svg
        className="absolute bottom-0 w-full"
        style={{ height: '62%' }}
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="
            0,600 0,490
            80,435 160,390 240,345 320,300
            400,265 460,280 520,225 580,190
            640,155 690,130 720,100 750,118
            800,138 850,118 900,130 950,158
            1000,185 1060,210 1120,185 1180,215
            1260,260 1340,310 1400,355 1440,380
            1440,600"
          fill={theme.farPeaks}
        />
        {/* Snow caps */}
        <polygon points="695,175 720,100 745,175 730,160 710,160" fill={theme.snow} opacity="0.95" />
        <polygon points="622,195 640,155 658,195 648,182 632,182" fill={theme.snow} opacity="0.90" />
        <polygon points="828,168 850,118 872,168 860,153 840,153" fill={theme.snow} opacity="0.92" />
        <polygon points="503,257 520,225 537,257 528,244 512,244" fill={theme.snow} opacity="0.85" />
        <polygon points="932,192 950,158 968,192 959,178 941,178" fill={theme.snow} opacity="0.85" />
      </svg>

      {/* ── Layer 2: Mid-distance ridgelines ────────────────────────────────── */}
      <svg
        className="absolute bottom-0 w-full"
        style={{ height: '46%' }}
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="
            0,400 0,340
            80,300 160,270 240,285 320,260
            400,240 480,255 560,230 640,248
            720,230 800,248 880,232 960,250
            1040,238 1120,252 1200,268 1300,285
            1400,305 1440,315
            1440,400"
          fill={theme.midRidge}
        />
        <polygon
          points="
            0,340 80,300 160,270 240,285 320,260
            400,240 480,255 560,230 640,248
            720,230 800,248 880,232 960,250
            1040,238 1120,252 1200,268 1300,285
            1400,305 1440,315
            1440,310 1400,300 1300,280 1200,262
            1120,246 1040,232 960,244 880,226
            800,242 720,224 640,242 560,224
            480,249 400,234 320,254 240,279
            160,264 80,294 0,334"
          fill="rgba(255,255,255,0.04)"
        />
      </svg>

      {/* ── Layer 3: Near forested hills ────────────────────────────────────── */}
      <svg
        className="absolute bottom-0 w-full"
        style={{ height: '32%' }}
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="
            0,300 0,245
            60,225 120,210 180,220 240,205
            320,190 400,200 480,188 560,202
            640,218 700,205 760,192 820,205
            880,218 940,205 1000,190 1080,202
            1160,215 1240,225 1340,238 1440,248
            1440,300"
          fill={theme.nearHills}
        />
        <polygon
          points="
            0,245 60,225 120,210 180,220 240,205
            320,190 400,200 480,188 560,202
            640,218 700,205 760,192 820,205
            880,218 940,205 1000,190 1080,202
            1160,215 1240,225 1340,238 1440,248
            1440,238 1340,228 1240,215 1160,205
            1080,192 1000,180 940,195 880,208
            820,195 760,182 700,195 640,208
            560,192 480,178 400,190 320,180
            240,195 180,210 120,200 60,215 0,235"
          fill="rgba(255,255,255,0.03)"
        />
      </svg>

      {/* ── Layer 4: Foreground ground + trail ──────────────────────────────── */}
      <svg
        className="absolute bottom-0 w-full"
        style={{ height: '20%' }}
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground */}
        <polygon
          points="
            0,150 0,100
            80,90 200,84 360,78 480,80
            600,72 700,68 720,65 740,68
            840,72 960,80 1100,84 1240,88
            1360,93 1440,97
            1440,150"
          fill={theme.ground}
        />

        {/* Path-specific trail */}
        <Trail pathType={pathType || 'default'} />

        {/* Foreground rocks/texture */}
        <ellipse cx="300"  cy="118" rx="28" ry="10" fill="rgba(0,0,0,0.18)" />
        <ellipse cx="1160" cy="112" rx="22" ry="8"  fill="rgba(0,0,0,0.15)" />
        <ellipse cx="900"  cy="125" rx="18" ry="7"  fill="rgba(0,0,0,0.12)" />
      </svg>
    </div>
  );
}
