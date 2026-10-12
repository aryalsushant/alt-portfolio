// Fire-and-forget gameplay events (sfx, particles, camera shake, UI).
const handlers = new Map();

export function on(type, fn) {
  if (!handlers.has(type)) handlers.set(type, new Set());
  handlers.get(type).add(fn);
  return () => handlers.get(type).delete(fn);
}

export function emit(type, payload) {
  const set = handlers.get(type);
  if (set) set.forEach(fn => fn(payload));
}

// Collider handles the follow camera treats as solid (terrain, bridges,
// large structures). Small props are ignored so the camera never snaps
// into the robot's face behind a sign or cabinet.
export const cameraBlockers = new Set();
