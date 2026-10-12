import { getState, setState, runtime } from '../core/store';
import { emit } from '../core/events';
import { clearInput } from '../input/input';
import { sfx } from '../audio/sound';
import { ZONES } from '../core/layout';

export function openPanel(panel) {
  setState({ panel });
  clearInput();
  sfx.open();
  emit('panelOpened', { key: `${panel.type}:${panel.id || ''}` });
}

export function closePanel() {
  if (!getState().panel) return;
  setState({ panel: null });
  clearInput();
  sfx.close();
}

// Fade to white, move the robot, fade back. Used by map fast travel.
export function warpTo(zoneId) {
  const z = ZONES.find(x => x.id === zoneId);
  if (!z) return;
  sfx.warp();
  setState({ fade: 1, mapOpen: false });
  setTimeout(() => {
    // land just inside the rim, facing the island centre
    const a = Math.atan2(runtime.player.z - z.z, runtime.player.x - z.x);
    const r = Math.min(z.r * 0.55, 6);
    const x = z.x + Math.cos(a) * r;
    const zz = z.z + Math.sin(a) * r;
    runtime.teleport = { x, y: z.y + 1.5, z: zz, yaw: Math.atan2(z.x - x, z.z - zz) };
    setTimeout(() => {
      emit('teleported', {});
      setState({ fade: 0 });
    }, 80);
  }, 380);
}
