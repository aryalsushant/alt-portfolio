// Unified input: keyboard, mouse, touch and gamepad all write into one
// mutable object that the simulation reads at a fixed step.
//
//   move       analog stick in screen space, x right, y forward, |v| <= 1
//   look       accumulated camera delta in radians since the last read
//   zoom       accumulated zoom delta (positive = further away)
//   pressed    edge-triggered actions, consumed by whoever handles them
//   held       level-triggered actions

export const input = {
  move: { x: 0, y: 0 },
  look: { x: 0, y: 0 },
  zoom: 0,
  held: { jump: false, dash: false },
  pressed: { jump: false, dash: false, interact: false },
  lastLookAt: 0, // performance.now() of last manual camera input
  enabled: true,
  touchMove: { x: 0, y: 0 }, // written by the on-screen joystick
};

const keys = new Set();

const BINDINGS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['Space'],
  dash: ['ShiftLeft', 'ShiftRight', 'KeyK'],
  interact: ['KeyE', 'Enter'],
};

const anyDown = codes => codes.some(c => keys.has(c));

export function press(action) {
  // interact stays live so the same key can close an open panel
  if (!input.enabled && action !== 'interact') return;
  input.pressed[action] = true;
  if (action in input.held) input.held[action] = true;
}

export function release(action) {
  if (action in input.held) input.held[action] = false;
}

export function consume(action) {
  const v = input.pressed[action];
  input.pressed[action] = false;
  return v;
}

export function addLook(dx, dy) {
  input.look.x += dx;
  input.look.y += dy;
  input.lastLookAt = performance.now();
}

export function takeLook() {
  const l = { x: input.look.x, y: input.look.y, zoom: input.zoom };
  input.look.x = 0;
  input.look.y = 0;
  input.zoom = 0;
  return l;
}

export function clearInput() {
  keys.clear();
  input.held.jump = false;
  input.held.dash = false;
  input.pressed.jump = false;
  input.pressed.dash = false;
  input.pressed.interact = false;
  input.touchMove.x = 0;
  input.touchMove.y = 0;
}

const isTyping = t =>
  t && (t.isContentEditable || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT');

// Keyboard listeners. `onAction` handles UI-level keys (pause, map…).
export function attachKeyboard(onAction) {
  const down = e => {
    if (isTyping(e.target)) return;
    const c = e.code;
    if (c === 'Escape' || c === 'KeyP') { onAction('pause'); e.preventDefault(); return; }
    if (c === 'KeyM' || c === 'Tab') { onAction('map'); e.preventDefault(); return; }
    if (c === 'KeyN' && !e.repeat) { onAction('mute'); return; }
    if (Object.values(BINDINGS).some(b => b.includes(c))) e.preventDefault();
    if (e.repeat) return;
    keys.add(c);
    for (const action of ['jump', 'dash', 'interact']) {
      if (BINDINGS[action].includes(c)) press(action);
    }
    onAction('any');
  };
  const up = e => {
    keys.delete(e.code);
    for (const action of ['jump', 'dash']) {
      if (!anyDown(BINDINGS[action])) release(action);
    }
  };
  const blur = () => clearInput();
  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  window.addEventListener('blur', blur);
  return () => {
    window.removeEventListener('keydown', down);
    window.removeEventListener('keyup', up);
    window.removeEventListener('blur', blur);
  };
}

// Mouse drag to orbit + wheel to zoom, on the canvas element only.
export function attachMouse(el) {
  let dragging = false;
  let lx = 0;
  let ly = 0;
  const downH = e => {
    if (e.pointerType !== 'mouse') return;
    dragging = true;
    lx = e.clientX;
    ly = e.clientY;
    el.setPointerCapture?.(e.pointerId);
    el.style.cursor = 'grabbing';
  };
  const moveH = e => {
    if (!dragging || e.pointerType !== 'mouse') return;
    addLook((e.clientX - lx) * 0.0055, (e.clientY - ly) * 0.0045);
    lx = e.clientX;
    ly = e.clientY;
  };
  const upH = e => {
    if (e.pointerType !== 'mouse') return;
    dragging = false;
    el.style.cursor = '';
  };
  const wheel = e => {
    e.preventDefault();
    input.zoom += Math.sign(e.deltaY) * Math.min(1.6, Math.abs(e.deltaY) * 0.01);
  };
  el.addEventListener('pointerdown', downH);
  window.addEventListener('pointermove', moveH);
  window.addEventListener('pointerup', upH);
  el.addEventListener('wheel', wheel, { passive: false });
  return () => {
    el.removeEventListener('pointerdown', downH);
    window.removeEventListener('pointermove', moveH);
    window.removeEventListener('pointerup', upH);
    el.removeEventListener('wheel', wheel);
  };
}

// Gamepad (standard mapping). Polled once per rendered frame.
const padPrev = {};
let padActive = false;
export function pollGamepad(dt, onAction) {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const gp = pads && Array.from(pads).find(p => p && p.mapping === 'standard');
  if (!gp) {
    if (padActive) { input.padMove = null; padActive = false; }
    return;
  }
  const dz = v => (Math.abs(v) < 0.18 ? 0 : (v - Math.sign(v) * 0.18) / 0.82);
  const lx = dz(gp.axes[0]);
  const ly = dz(gp.axes[1]);
  const rx = dz(gp.axes[2]);
  const ry = dz(gp.axes[3]);
  input.padMove = { x: lx, y: -ly };
  if (rx || ry) addLook(rx * 2.6 * dt, ry * 2 * dt);
  const btn = i => gp.buttons[i] && gp.buttons[i].pressed;
  const edge = (i, fn) => {
    const now = btn(i);
    if (now && !padPrev[i]) fn();
    padPrev[i] = now;
  };
  edge(0, () => press('jump'));
  edge(2, () => press('dash'));
  edge(1, () => press('dash'));
  edge(3, () => press('interact'));
  edge(9, () => onAction('pause'));
  edge(8, () => onAction('map'));
  if (!btn(0)) release('jump');
  if (lx || ly || btn(0)) { padActive = true; onAction('any'); }
}

// Resolve final move vector from all sources, clamped to the unit circle.
export function readMove() {
  if (!input.enabled) return { x: 0, y: 0 };
  let x = 0;
  let y = 0;
  if (anyDown(BINDINGS.forward)) y += 1;
  if (anyDown(BINDINGS.back)) y -= 1;
  if (anyDown(BINDINGS.right)) x += 1;
  if (anyDown(BINDINGS.left)) x -= 1;
  x += input.touchMove.x;
  y += input.touchMove.y;
  if (input.padMove) {
    x += input.padMove.x;
    y += input.padMove.y;
  }
  const len = Math.hypot(x, y);
  if (len > 1) {
    x /= len;
    y /= len;
  }
  return { x, y };
}
