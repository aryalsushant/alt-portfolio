import React from 'react';

/**
 * Modular chibi character placeholder.
 * To swap in illustrated art later: replace the <svg> with an <img src={...} />
 * and keep the wrapper div so animations and click handlers stay intact.
 */
export default function Character({ size = 100, onClick, className = '', pose = 'idle' }) {
  const height = size * 1.25; // viewBox is 80×100, so height = size * (100/80)

  return (
    <div
      className={`character-idle cursor-pointer select-none ${className}`}
      style={{ width: size, height }}
      onClick={onClick}
      role="button"
      aria-label="Open contact info"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <svg
        viewBox="0 0 80 100"
        width={size}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* ── Backpack (drawn before body so body sits in front) ── */}
        <rect x="13" y="37" width="13" height="21" rx="4" fill="#bb2211" />
        <rect x="14" y="39" width="5" height="4" rx="2" fill="#991100" />
        {/* backpack strap detail */}
        <line x1="19" y1="38" x2="23" y2="45" stroke="#991100" strokeWidth="1.5" strokeLinecap="round" />

        {/* ── Body / jacket ── */}
        <rect x="23" y="35" width="34" height="26" rx="9" fill="#1f4fbf" />
        {/* jacket centre seam */}
        <line x1="40" y1="37" x2="40" y2="59" stroke="#1740a8" strokeWidth="1.5" strokeLinecap="round" />

        {/* ── Arms ── */}
        <rect x="9" y="38" width="16" height="9" rx="4.5" fill="#1f4fbf" />
        <rect x="55" y="38" width="16" height="9" rx="4.5" fill="#1f4fbf" />
        {/* gloves */}
        <circle cx="13" cy="46" r="5" fill="#334455" />
        <circle cx="67" cy="46" r="5" fill="#334455" />

        {/* ── Legs ── */}
        <rect x="26" y="59" width="11" height="22" rx="4" fill="#1a3a8a" />
        <rect x="43" y="59" width="11" height="22" rx="4" fill="#1a3a8a" />

        {/* ── Boots ── */}
        <rect x="22" y="77" width="16" height="11" rx="5" fill="#5c3318" />
        <rect x="42" y="77" width="16" height="11" rx="5" fill="#5c3318" />
        {/* boot toe bump */}
        <ellipse cx="26" cy="88" rx="5" ry="3" fill="#4a2810" />
        <ellipse cx="46" cy="88" rx="5" ry="3" fill="#4a2810" />

        {/* ── Head ── */}
        <circle cx="40" cy="22" r="17" fill="#f0c060" />

        {/* ── Beanie ── */}
        <rect x="22" y="8" width="36" height="17" rx="7" fill="#2244bb" />
        {/* cuff band */}
        <rect x="21" y="18" width="38" height="6" rx="2" fill="#3355cc" />
        {/* knit line details */}
        <line x1="31" y1="9" x2="31" y2="24" stroke="#3a5add" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="40" y1="9" x2="40" y2="24" stroke="#3a5add" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="49" y1="9" x2="49" y2="24" stroke="#3a5add" strokeWidth="1.2" strokeLinecap="round" />

        {/* ── Pompom ── */}
        <circle cx="40" cy="4" r="5" fill="#ff5522" />
        <circle cx="38.5" cy="2.5" r="1.5" fill="rgba(255,255,255,0.4)" />

        {/* ── Eyes ── */}
        <circle cx="33" cy="21" r="3" fill="#2a180a" />
        <circle cx="47" cy="21" r="3" fill="#2a180a" />
        {/* eye shine */}
        <circle cx="34.5" cy="19.5" r="1.2" fill="white" />
        <circle cx="48.5" cy="19.5" r="1.2" fill="white" />

        {/* ── Rosy cheeks ── */}
        <ellipse cx="29" cy="27" rx="4" ry="3" fill="rgba(255,130,90,0.38)" />
        <ellipse cx="51" cy="27" rx="4" ry="3" fill="rgba(255,130,90,0.38)" />

        {/* ── Smile ── */}
        <path
          d="M 34 29 Q 40 35 46 29"
          stroke="#c06030"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
