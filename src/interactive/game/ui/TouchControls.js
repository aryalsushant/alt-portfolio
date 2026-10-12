import React, { useEffect, useRef } from 'react';
import { useGame } from '../core/store';
import { input, press, release, addLook } from '../input/input';
import { emit } from '../core/events';

const RADIUS = 56;
const buzz = ms => {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
};

// Left half: floating analog stick that appears under the thumb.
// Right half: drag to orbit the camera, two fingers to pinch-zoom.
// Buttons sit on top of the right half and swallow their own touches.
export default function TouchControls({ onInteract }) {
  const prompt = useGame(s => s.prompt);
  const panel = useGame(s => s.panel);
  const stickRef = useRef(null);
  const knobRef = useRef(null);
  const zoneRef = useRef(null);

  useEffect(() => {
    const zone = zoneRef.current;
    const stick = { id: null, ox: 0, oy: 0 };
    const looks = new Map(); // pointerId -> {x, y}
    const taps = new Map(); // pointerId -> {x, y, t, moved} for tap-to-select
    let pinch = 0;

    const showStick = (x, y) => {
      const s = stickRef.current;
      s.style.transform = `translate(${x - RADIUS}px, ${y - RADIUS}px)`;
      s.classList.add('is-on');
    };
    const hideStick = () => {
      stickRef.current.classList.remove('is-on');
      knobRef.current.style.transform = 'translate(0px, 0px)';
      input.touchMove.x = 0;
      input.touchMove.y = 0;
    };

    const down = e => {
      if (e.pointerType === 'mouse') return;
      taps.set(e.pointerId, { x: e.clientX, y: e.clientY, t: performance.now(), moved: false });
      const left = e.clientX < window.innerWidth * 0.45;
      if (left && stick.id === null) {
        stick.id = e.pointerId;
        stick.ox = e.clientX;
        stick.oy = e.clientY;
        showStick(e.clientX, e.clientY);
      } else {
        looks.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (looks.size === 2) {
          const [a, b] = [...looks.values()];
          pinch = Math.hypot(a.x - b.x, a.y - b.y);
        }
      }
      zone.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    };

    const move = e => {
      const tap = taps.get(e.pointerId);
      if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 10) tap.moved = true;
      if (e.pointerId === stick.id) {
        let dx = e.clientX - stick.ox;
        let dy = e.clientY - stick.oy;
        const d = Math.hypot(dx, dy);
        // drag the base along when the thumb overshoots, like modern mobile games
        if (d > RADIUS) {
          const k = (d - RADIUS) / d;
          stick.ox += dx * k;
          stick.oy += dy * k;
          dx = e.clientX - stick.ox;
          dy = e.clientY - stick.oy;
          showStick(stick.ox, stick.oy);
        }
        knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
        const nx = dx / RADIUS;
        const ny = dy / RADIUS;
        const mag = Math.min(1, Math.hypot(nx, ny));
        // small dead zone, then full range
        const k = mag < 0.12 ? 0 : (mag - 0.12) / 0.88 / (mag || 1);
        input.touchMove.x = nx * k;
        input.touchMove.y = -ny * k;
        return;
      }
      const p = looks.get(e.pointerId);
      if (!p) return;
      if (looks.size >= 2) {
        p.x = e.clientX;
        p.y = e.clientY;
        const [a, b] = [...looks.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        input.zoom += (pinch - dist) * 0.03;
        pinch = dist;
        return;
      }
      addLook((e.clientX - p.x) * 0.008, (e.clientY - p.y) * 0.006);
      p.x = e.clientX;
      p.y = e.clientY;
    };

    const up = e => {
      // a quick, still touch selects whatever landmark is under the finger
      const tap = taps.get(e.pointerId);
      taps.delete(e.pointerId);
      if (e.type === 'pointerup' && tap && !tap.moved && performance.now() - tap.t < 300 && looks.size <= 1) {
        emit('tap', { x: e.clientX, y: e.clientY });
      }
      if (e.pointerId === stick.id) {
        stick.id = null;
        hideStick();
      }
      looks.delete(e.pointerId);
    };

    zone.addEventListener('pointerdown', down, { passive: false });
    zone.addEventListener('pointermove', move);
    zone.addEventListener('pointerup', up);
    zone.addEventListener('pointercancel', up);
    return () => {
      zone.removeEventListener('pointerdown', down);
      zone.removeEventListener('pointermove', move);
      zone.removeEventListener('pointerup', up);
      zone.removeEventListener('pointercancel', up);
      input.touchMove.x = 0;
      input.touchMove.y = 0;
    };
  }, []);

  const btn = (action, hapticMs) => ({
    onPointerDown: e => {
      e.stopPropagation();
      e.preventDefault();
      e.currentTarget.classList.add('is-down');
      press(action);
      buzz(hapticMs);
    },
    onPointerUp: e => {
      e.currentTarget.classList.remove('is-down');
      release(action);
    },
    onPointerCancel: e => {
      e.currentTarget.classList.remove('is-down');
      release(action);
    },
    onContextMenu: e => e.preventDefault(),
  });

  return (
    <div className="gx-touch">
      <div ref={zoneRef} className="gx-touch-zone" />
      <div ref={stickRef} className="gx-stick">
        <div ref={knobRef} className="gx-knob" />
      </div>
      <div className="gx-touch-buttons">
        {prompt && !panel && (
          <button
            className="gx-tbtn gx-tbtn--act"
            onPointerDown={e => {
              e.stopPropagation();
              e.preventDefault();
              buzz(12);
              onInteract();
            }}
          >
            {prompt.verb}
          </button>
        )}
        <button className="gx-tbtn gx-tbtn--dash" aria-label="Dash" {...btn('dash', 15)}>
          ⇢
        </button>
        <button className="gx-tbtn gx-tbtn--jump" aria-label="Jump" {...btn('jump', 10)}>
          ⤒
        </button>
      </div>
    </div>
  );
}
