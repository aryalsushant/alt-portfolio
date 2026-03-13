import React from 'react';

/**
 * Layered Himalayan mountain background.
 * Each layer is a separate absolutely-positioned SVG at the bottom of the container.
 * preserveAspectRatio="none" stretches the ridgelines to fill any screen width —
 * this works well for horizontal mountain shapes.
 *
 * Layers (front to back):
 *   4. Foreground ground + dirt trail
 *   3. Near forested hills
 *   2. Mid-distance ridgelines
 *   1. Distant snow-capped peaks
 *   0. Sky gradient (CSS)
 */

// ─── Cloud component ─────────────────────────────────────────────────────────
function Cloud({ cx, cy, scale = 1, opacity = 0.13 }) {
  const s = scale;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${s})`} opacity={opacity}>
      <ellipse cx="0" cy="0" rx="80" ry="28" fill="white" />
      <ellipse cx="-40" cy="8" rx="50" ry="22" fill="white" />
      <ellipse cx="42" cy="8" rx="55" ry="24" fill="white" />
      <ellipse cx="-10" cy="-10" rx="38" ry="20" fill="white" />
    </g>
  );
}

export default function MountainScene() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{
        // Sky: deep night-blue at top → mountain blue → pale sky → warm valley base
        background: `linear-gradient(to bottom,
          #0a1628 0%,
          #122040 12%,
          #1a3d6b 28%,
          #2e6fa0 45%,
          #5b9bc4 62%,
          #9cc4d8 74%,
          #cde3eb 83%,
          #e8dfd0 90%,
          #dfc9a0 100%
        )`,
      }}
    >
      {/* ── Clouds ──────────────────────────────────────────────────────────── */}
      <svg
        className="absolute w-full"
        style={{ top: '8%', height: '22%' }}
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Cloud cx={160} cy={60} scale={0.9} opacity={0.10} />
        <Cloud cx={480} cy={35} scale={1.1} opacity={0.13} />
        <Cloud cx={820} cy={55} scale={0.75} opacity={0.09} />
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
        {/* Main ridge */}
        <polygon
          points="
            0,600 0,490
            80,435 160,390 240,345 320,300
            400,265 460,280 520,225 580,190
            640,155 690,130 720,100 750,118
            800,138 850,118 900,130 950,158
            1000,185 1060,210 1120,185 1180,215
            1260,260 1340,310 1400,355 1440,380
            1440,600
          "
          fill="#b8ccd8"
        />

        {/* Snow caps — separate lighter polygons on the highest peaks */}
        {/* Central main peak (x≈720) */}
        <polygon points="695,175 720,100 745,175 730,160 710,160" fill="#eef3f7" opacity="0.95" />
        {/* Peak at x≈640 */}
        <polygon points="622,195 640,155 658,195 648,182 632,182" fill="#eef3f7" opacity="0.9" />
        {/* Peak at x≈850 */}
        <polygon points="828,168 850,118 872,168 860,153 840,153" fill="#eef3f7" opacity="0.92" />
        {/* Peak at x≈520 */}
        <polygon points="503,257 520,225 537,257 528,244 512,244" fill="#eef3f7" opacity="0.85" />
        {/* Peak at x≈950 */}
        <polygon points="932,192 950,158 968,192 959,178 941,178" fill="#eef3f7" opacity="0.85" />
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
            1440,400
          "
          fill="#3d6b88"
        />
        {/* Subtle ridge highlight */}
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
            160,264 80,294 0,334
          "
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
            1440,300
          "
          fill="#285242"
        />
        {/* Subtle tree-line texture using a slightly different shade */}
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
            240,195 180,210 120,200 60,215 0,235
          "
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
            1440,150
          "
          fill="#1a2e1e"
        />

        {/* Dirt trail — a narrow lighter path running up from center bottom */}
        <path
          d="
            M 708,150 C 706,132 708,112 716,92
            L 720,80 L 724,80
            C 732,92 734,112 732,150 Z
          "
          fill="#7a6048"
          opacity="0.75"
        />
        {/* Trail edge highlight */}
        <path
          d="M 720,80 C 714,92 710,112 708,150"
          stroke="rgba(180,150,100,0.3)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 720,80 C 726,92 730,112 732,150"
          stroke="rgba(180,150,100,0.3)"
          strokeWidth="1"
          fill="none"
        />

        {/* Foreground rocks/texture */}
        <ellipse cx="300" cy="118" rx="28" ry="10" fill="rgba(0,0,0,0.18)" />
        <ellipse cx="1160" cy="112" rx="22" ry="8" fill="rgba(0,0,0,0.15)" />
        <ellipse cx="900" cy="125" rx="18" ry="7" fill="rgba(0,0,0,0.12)" />
      </svg>
    </div>
  );
}
