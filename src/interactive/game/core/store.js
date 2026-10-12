import { useSyncExternalStore } from 'react';

// Tiny external store for UI-facing game state (React re-renders only on
// change). Per-frame simulation data lives in `runtime` below instead, which
// is a plain mutable object read inside animation loops.

const SAVE_KEY = 'sa-archipelago-save-v1';

function loadSave() {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const saved = loadSave();

let state = {
  phase: 'loading', // loading → title → intro → playing
  paused: false,
  panel: null, // { type, id }
  mapOpen: false,
  zone: null, // id of the zone the player is standing in
  prompt: null, // { id, label, verb } nearest interactable
  toasts: [],
  discovered: saved.discovered || [],
  shards: saved.shards || [],
  achievements: saved.achievements || [],
  panelsOpened: saved.panelsOpened || [],
  muted: saved.muted ?? false,
  quality: saved.quality || 'auto', // auto | low | medium | high
  tier: 'high', // resolved tier currently rendering
  touch: false,
  fade: 0, // 0..1 screen fade for respawn / fast travel
};

const listeners = new Set();

function persist() {
  try {
    window.localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        discovered: state.discovered,
        shards: state.shards,
        achievements: state.achievements,
        panelsOpened: state.panelsOpened,
        muted: state.muted,
        quality: state.quality,
      })
    );
  } catch {
    /* storage unavailable (private mode) — progress just won't persist */
  }
}

export const getState = () => state;

export function setState(patch) {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  listeners.forEach(l => l());
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useGame(selector) {
  return useSyncExternalStore(subscribe, () => selector(state));
}

let toastId = 0;
export function toast(t) {
  const id = ++toastId;
  setState(s => ({ toasts: [...s.toasts, { id, ...t }].slice(-4) }));
  setTimeout(() => setState(s => ({ toasts: s.toasts.filter(x => x.id !== id) })), t.duration || 4200);
}

export function addUnique(key, value) {
  if (state[key].includes(value)) return false;
  setState({ [key]: [...state[key], value] });
  persist();
  return true;
}

export function setPersisted(patch) {
  setState(patch);
  persist();
}

export function resetProgress() {
  setState({ discovered: [], shards: [], achievements: [], panelsOpened: [] });
  persist();
}

// Mutable per-frame data shared between the simulation and canvas-drawn UI.
export const runtime = {
  player: { x: 0, y: 0, z: 0, yaw: 0, speed: 0, grounded: true, vy: 0 },
  camera: { yaw: 0 },
  teleport: null, // { x, y, z, yaw } request consumed by the player controller
  time: 0,
};
