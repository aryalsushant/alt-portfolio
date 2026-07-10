import React, { useRef } from 'react';
import { useFrame } from '../engine/useScrollDriver';
import { seg, robotStateFor, JUMPS, JUMP_SPAN } from '../engine/timeline';
import { mapRange, easeInOut, easeInCubic, easeOutCubic, clamp, lerp, invLerp } from '../engine/math';

// Screen-space character. Position is driven per-frame via CSS vars
// (--rx in vw, --ry in vh); pose/limb animation is pure CSS keyed to
// [data-state] in interactive.css.
export default function Robot() {
  const ref = useRef(null);
  const lastState = useRef('');
  const swing = useRef({ amp: 0, t: 0 });

  useFrame(s => {
    const el = ref.current;
    if (!el) return;

    const st = robotStateFor(s.yVh); // raw scroll → exact state boundaries

    const y = s.smoothYVh;
    let rx = 38, ry = 64, sw = 0;
    let effState = st;

    switch (st) {
      case 'idle':
        rx = 46;
        break;
      case 'bungee': {
        // free-fall dips below center while the camera dives, then the
        // cord catches and pulls back up to the hanging height
        const t = seg('bungee', y);
        rx = 40;
        ry = mapRange(t, 0, 1, 64, 30, easeInOut) + Math.sin(t * Math.PI) * 18;
        break;
      }
      case 'hanging': {
        rx = 40;
        ry = 30;
        const v = clamp(Math.abs(s.vy) * 0.12, 0, 16);
        swing.current.amp = lerp(swing.current.amp, 7 + v, 0.05);
        swing.current.t += 0.03;
        sw = Math.sin(swing.current.t * 2.1) * swing.current.amp;
        break;
      }
      case 'plane': {
        const t = seg('plane', y);
        rx = 40;
        ry = t < 0.55
          ? mapRange(t, 0, 0.55, 30, 10, easeOutCubic)   // lifted high
          : mapRange(t, 0.55, 1, 10, 64, easeInCubic);   // set down on ground
        swing.current.t += 0.025;
        sw = Math.sin(swing.current.t * 2.1) * 4;        // dangling off the tow rope
        break;
      }
      case 'climbing':
        rx = 40;
        ry = 58;
        break;
      case 'jumping': {
        // hop from the slope onto the contact card
        const t = clamp(seg('ending', y) / 0.4, 0, 1);
        rx = lerp(38, 42, t);
        ry = lerp(58, 21.5, easeOutCubic(t)) - Math.sin(t * Math.PI) * 12;
        break;
      }
      case 'napping':
        rx = 42;
        ry = 21.5;
        break;
      default: {
        // walking — hop over any ground rock we're passing
        for (const yJ of JUMPS) {
          const t = invLerp(yJ - JUMP_SPAN, yJ + JUMP_SPAN, y);
          if (t > 0 && t < 1) {
            ry = 64 - Math.sin(t * Math.PI) * 15;
            if (t > 0.15 && t < 0.85) effState = 'jumping';
            break;
          }
        }
        break;
      }
    }

    if (effState !== lastState.current) {
      el.dataset.state = effState;
      lastState.current = effState;
    }

    el.style.setProperty('--rx', rx.toFixed(2));
    el.style.setProperty('--ry', ry.toFixed(2));
    el.style.setProperty('--swing', sw.toFixed(2));
  });

  return (
    <div ref={ref} className="ip-robot" data-state="idle">
      <div className="ip-robot-swing">
        <div className="ip-cord" />
        <div className="ip-robot-pose">
          <svg viewBox="0 0 100 140" aria-label="Robot character">
            <defs>
              <linearGradient id="rb-head" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f4f6fb" />
                <stop offset="1" stopColor="#c9d2e4" />
              </linearGradient>
              <linearGradient id="rb-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ff9d6b" />
                <stop offset="1" stopColor="#e5643c" />
              </linearGradient>
            </defs>

            <g id="body-group">
              {/* antenna */}
              <line x1="50" y1="16" x2="50" y2="5" stroke="#8f99b4" strokeWidth="3" />
              <circle id="antenna-tip" cx="50" cy="4" r="4.5" fill="#ffd166" />

              {/* arms (behind body) */}
              <rect id="arm-l" x="14" y="56" width="12" height="34" rx="6" fill="#aab4cc" />
              <rect id="arm-r" x="74" y="56" width="12" height="34" rx="6" fill="#aab4cc" />

              {/* legs */}
              <g id="leg-l">
                <rect x="34" y="96" width="11" height="26" rx="5" fill="#8f99b4" />
                <ellipse cx="39.5" cy="124" rx="9" ry="5" fill="#4b5470" />
              </g>
              <g id="leg-r">
                <rect x="55" y="96" width="11" height="26" rx="5" fill="#8f99b4" />
                <ellipse cx="60.5" cy="124" rx="9" ry="5" fill="#4b5470" />
              </g>

              {/* body */}
              <rect x="28" y="50" width="44" height="50" rx="13" fill="url(#rb-body)" />
              <circle cx="50" cy="70" r="6.5" fill="#ffd166" stroke="#b34a24" strokeWidth="2" />
              <rect x="40" y="82" width="20" height="8" rx="3" fill="rgba(0,0,0,.22)" />

              {/* bungee cord wrapped around the waist (shown while roped) */}
              <g id="waist-rope">
                <rect x="26" y="80" width="48" height="6.5" rx="3" fill="#ff7ac8" />
                <rect x="26" y="83.5" width="48" height="3" rx="1.5" fill="#e8578f" />
                <path d="M32 80 L34 87 M42 80 L44 87 M56 80 L58 87 M66 80 L68 87"
                  stroke="#c23f73" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="50" cy="83" r="4.4" fill="#e8578f" stroke="#c23f73" strokeWidth="1.6" />
              </g>

              {/* head */}
              <rect x="24" y="14" width="52" height="36" rx="16" fill="url(#rb-head)" />
              <rect x="30" y="22" width="40" height="22" rx="10" fill="#1c2138" />

              {/* eyes: three variants toggled by CSS */}
              <g id="eyes-open">
                <circle cx="42" cy="33" r="4.6" fill="#63e7de" />
                <circle cx="58" cy="33" r="4.6" fill="#63e7de" />
                <circle cx="43.5" cy="31.5" r="1.6" fill="#ffffff" />
                <circle cx="59.5" cy="31.5" r="1.6" fill="#ffffff" />
              </g>
              <g id="eyes-x" stroke="#63e7de" strokeWidth="2.4" strokeLinecap="round">
                <path d="M38 29 L46 37 M46 29 L38 37" />
                <path d="M54 29 L62 37 M62 29 L54 37" />
              </g>
              <g id="eyes-closed" stroke="#63e7de" strokeWidth="2.4" strokeLinecap="round" fill="none">
                <path d="M38 34 Q42 38 46 34" />
                <path d="M54 34 Q58 38 62 34" />
              </g>

              {/* cheek lights */}
              <circle cx="33" cy="40" r="2" fill="#ff7ac8" opacity=".7" />
              <circle cx="67" cy="40" r="2" fill="#ff7ac8" opacity=".7" />
            </g>

            {/* nap bubbles */}
            <g id="zzz" fill="#f3f1ea" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
              <text x="74" y="12" fontSize="13">z</text>
              <text x="84" y="4" fontSize="16">Z</text>
              <text x="94" y="-6" fontSize="20">Z</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
