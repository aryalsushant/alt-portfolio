import { getState, setState, runtime } from '../core/store';
import { emit } from '../core/events';
import { clearInput } from '../input/input';
import { sfx } from '../audio/sound';
import { INTERACTABLES, viewpointFor, standPointFor, interactableFor } from '../core/layout';

// Panels are a non-blocking sidebar: the robot keeps moving while one is
// open. mode 'auto' = opened by walking up to something (closes when you
// walk away); mode 'open' = opened on purpose (click, E, prev/next travel).

const keyOf = p => `${p.type}:${p.id || ''}`;
let dismissed = null; // interactable the player closed while standing at it

export function openPanel(panel, mode = 'open') {
  const cur = getState().panel;
  if (cur && keyOf(cur) === keyOf(panel) && (cur.mode === mode || mode === 'auto')) return;
  setState({ panel: { ...panel, mode } });
  if (mode === 'open') {
    clearInput();
    sfx.open();
  } else {
    sfx.hover();
  }
  emit('panelOpened', { key: keyOf(panel) });
}

export function closePanel() {
  const s = getState();
  if (!s.panel) return;
  if (s.prompt && keyOf(s.prompt.panel) === keyOf(s.panel)) dismissed = s.prompt.id;
  setState({ panel: null });
  sfx.close();
}

// Called whenever the nearest interactable changes.
export function syncProximityPanel(prompt) {
  const s = getState();
  if (s.phase !== 'playing') return;
  if (!prompt) {
    dismissed = null;
    if (s.panel && s.panel.mode === 'auto') setState({ panel: null });
    return;
  }
  if (dismissed && dismissed !== prompt.id) dismissed = null;
  if (dismissed === prompt.id || prompt.panel.type === 'classic') return;
  openPanel(prompt.panel, 'auto');
}

function fadeTeleport(dest, after) {
  sfx.warp();
  setState({ fade: 1, mapOpen: false, prompt: null });
  setTimeout(() => {
    runtime.teleport = dest;
    setTimeout(() => {
      emit('teleported', {});
      setState({ fade: 0 });
      if (after) after();
    }, 80);
  }, 300);
}

// Map fast travel: land mid-island facing the exhibits.
export function warpTo(zoneId) {
  const v = viewpointFor(zoneId);
  if (v) fadeTeleport(v);
}

// Sidebar prev/next: move the robot in front of that exhibit, facing it.
export function travelToPanel(panel) {
  const it = interactableFor(panel);
  const dest = it && standPointFor(it.id);
  setState({ panel: { ...panel, mode: 'open' } });
  sfx.click();
  if (dest) fadeTeleport(dest);
}

export function interactableById(id) {
  return INTERACTABLES.find(i => i.id === id);
}
