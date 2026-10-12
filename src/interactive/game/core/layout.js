import { EXPERIENCE, PROJECTS, SKILLS, EDUCATION } from '../../content';

// World layout — single source of truth. Units are metres, y is up.
// The player spawns on the central island and the world unfolds toward -z.

export const SPAWN = { x: 0, y: 1.2, z: 5, yaw: Math.PI }; // yaw π faces -z

export const ISLANDS = [
  { id: 'spawn', x: 0, z: 0, y: 0, r: 13, grass: '#7ccf6a', seed: 1 },
  { id: 'about', x: -30, z: -16, y: 1.5, r: 10, grass: '#8fd46b', seed: 2 },
  { id: 'skills', x: 30, z: -16, y: 1.5, r: 10.5, grass: '#6fc7a4', seed: 3 },
  { id: 'experience', x: 0, z: -46, y: 0, r: 15, grass: '#86c95f', seed: 4 },
  { id: 'projects', x: 44, z: -54, y: 0.5, r: 16, grass: '#5fbf8f', seed: 5 },
  { id: 'research', x: -42, z: -54, y: 5, r: 9.5, grass: '#9bc96a', seed: 6 },
  { id: 'education', x: -34, z: -92, y: 2, r: 13, grass: '#a6cf63', seed: 7 },
  { id: 'contact', x: 6, z: -96, y: 1, r: 11, grass: '#7fcf86', seed: 8 },
  { id: 'awards', x: 46, z: -102, y: 14, r: 8, grass: '#b8d86c', seed: 9 },
];

export const islandById = Object.fromEntries(ISLANDS.map(i => [i.id, i]));

export const ZONES = [
  { id: 'spawn', name: 'Spawn Point', icon: '◎', color: '#ffffff' },
  { id: 'about', name: 'About Grove', icon: '✿', color: '#8fd46b' },
  { id: 'skills', name: 'Skill Crystals', icon: '◆', color: '#63e7de' },
  { id: 'experience', name: 'Career Monoliths', icon: '▣', color: '#ffb454' },
  { id: 'projects', name: 'Project Arcade', icon: '▶', color: '#ff7ac8' },
  { id: 'research', name: 'Observatory', icon: '✦', color: '#9d8cff' },
  { id: 'education', name: 'Academy', icon: '◈', color: '#ffc72c' },
  { id: 'contact', name: 'Signal Tower', icon: '✉', color: '#7db8ff' },
  { id: 'awards', name: 'Trophy Summit', icon: '★', color: '#ffd166' },
].map(z => ({ ...z, ...islandById[z.id] }));

// Bridges are generated edge-to-edge between two islands.
const BRIDGE_PAIRS = [
  ['spawn', 'about'],
  ['spawn', 'skills'],
  ['spawn', 'experience'],
  ['about', 'research'],
  ['skills', 'projects'],
  ['experience', 'projects'],
  ['experience', 'education'],
  ['research', 'education'],
  ['experience', 'contact'],
  ['education', 'contact'],
];

export const BRIDGES = BRIDGE_PAIRS.map(([a, b]) => {
  const A = islandById[a];
  const B = islandById[b];
  const dx = B.x - A.x;
  const dz = B.z - A.z;
  const d = Math.hypot(dx, dz);
  const ux = dx / d;
  const uz = dz / d;
  const inset = 1.6; // overlap into each island so there is no seam
  return {
    id: `${a}-${b}`,
    from: { x: A.x + ux * (A.r - inset), y: A.y, z: A.z + uz * (A.r - inset) },
    to: { x: B.x - ux * (B.r - inset), y: B.y, z: B.z - uz * (B.r - inset) },
  };
});

// Floating stepping stones from the Project Arcade up to the Trophy Summit.
export const STONES = Array.from({ length: 5 }, (_, i) => ({
  id: `stone-${i}`,
  x: 46 + (i % 2 ? 2.4 : -2.4),
  z: -76 - i * 3.6,
  y: 7.2 + i * 1.35,
  r: 1.8,
}));

// Jump pads: standing on one launches the player.
export const JUMP_PADS = [
  { id: 'pad-summit', x: 46, z: -66, y: 0.5, power: 23, color: '#ffd166' },
  { id: 'pad-spawn', x: -9, z: 2, y: 0, power: 17, color: '#63e7de' },
  { id: 'pad-research', x: -35.7, z: -17.9, y: 1.5, power: 17, color: '#9d8cff' },
];

// Helpers to place things on islands by polar coords around the centre.
const on = (id, angle, radius, lift = 0) => {
  const I = islandById[id];
  return { x: I.x + Math.cos(angle) * radius, y: I.y + lift, z: I.z + Math.sin(angle) * radius };
};

// Experience monoliths stand in an arc facing the incoming bridge (+z side).
// Angles (×π) are picked to stay clear of bridge mouths.
const MONOLITH_ANGLES = [1.12, 1.41, 1.67, 1.8];
const CABINET_ANGLES = [0.76, 1.06, 1.2, 1.34, 1.72, 1.88, 2.04, 2.2, 2.36];
const CRYSTAL_ANGLES = [0.05, 0.4, 1.18, 1.38];
const LANDMARK_ANGLES = [1.05, 1.55];

export const MONOLITHS = EXPERIENCE.map((e, i) => {
  const a = Math.PI * MONOLITH_ANGLES[i];
  const p = on('experience', a, 9.5);
  return { ...p, id: e.id, data: e, face: Math.atan2(islandById.experience.x - p.x, islandById.experience.z - p.z) };
});

// Arcade cabinets ring the Project Arcade, screens facing the centre.
export const CABINETS = PROJECTS.map((p, i) => {
  const pos = on('projects', Math.PI * CABINET_ANGLES[i], 10.5);
  return { ...pos, id: p.id, data: p, face: Math.atan2(islandById.projects.x - pos.x, islandById.projects.z - pos.z) };
});

export const CRYSTALS = SKILLS.map((s, i) => {
  return { ...on('skills', Math.PI * CRYSTAL_ANGLES[i], 5.6), id: s.id, data: s };
});

export const LANDMARKS = EDUCATION.map((e, i) => {
  const p = on('education', Math.PI * LANDMARK_ANGLES[i], 6.5);
  return { ...p, id: e.id, data: e, face: Math.atan2(islandById.education.x - p.x, islandById.education.z - p.z) };
});

// Everything the player can walk up to and "read".
export const INTERACTABLES = [
  { id: 'howto', label: 'How to play', verb: 'Read', panel: { type: 'howto' }, ...on('spawn', Math.PI * 0.32, 7) },
  { id: 'classic', label: 'Classic portfolio', verb: 'Enter', panel: { type: 'classic' }, ...on('spawn', Math.PI * 0.68, 8.5) },
  { id: 'about', label: 'About Sushant', verb: 'Read', panel: { type: 'about' }, ...on('about', Math.PI * 1.5, 1.8) },
  { id: 'monk', label: 'Low cortisol bot', verb: 'Meditate', panel: { type: 'about' }, ...on('about', Math.PI * 0.75, 5.6) },
  ...CRYSTALS.map(c => ({ id: `skill-${c.id}`, label: c.data.group, verb: 'Inspect', panel: { type: 'skills', id: c.id }, x: c.x, y: c.y, z: c.z, r: 3.4 })),
  ...MONOLITHS.map(m => ({ id: `exp-${m.id}`, label: m.data.company, verb: 'Read', panel: { type: 'experience', id: m.id }, x: m.x, y: m.y, z: m.z, r: 3.6 })),
  ...CABINETS.map(c => ({ id: `proj-${c.id}`, label: c.data.name, verb: 'Play', panel: { type: 'project', id: c.id }, x: c.x, y: c.y, z: c.z, r: 2.9 })),
  { id: 'research', label: 'Research paper', verb: 'Read', panel: { type: 'research' }, ...on('research', 0, 0) , r: 4 },
  ...LANDMARKS.map(l => ({ id: `edu-${l.id}`, label: l.data.school, verb: 'Read', panel: { type: 'education', id: l.id }, x: l.x, y: l.y, z: l.z, r: 4.2 })),
  { id: 'contact', label: 'Signal terminal', verb: 'Open', panel: { type: 'contact' }, ...on('contact', Math.PI * 1.75, 3.4), r: 3.4 },
  { id: 'awards', label: 'Trophy podium', verb: 'View', panel: { type: 'awards' }, ...on('awards', 0, 0), r: 4.4 },
].map(i => ({ r: 3, ...i }));

// Data shards: collectibles scattered over islands, bridges and the climb.
export const SHARDS = (() => {
  const list = [];
  const ring = (id, n, radius, start = 0, lift = 1.1) => {
    for (let i = 0; i < n; i++) {
      const a = start + (i / n) * Math.PI * 2;
      list.push(on(id, a, radius, lift));
    }
  };
  ring('spawn', 3, 10.5, 0.4);
  ring('about', 2, 7.5, 0.2);
  ring('skills', 2, 8.2, 1.1);
  ring('experience', 3, 12.5, 0.1);
  ring('projects', 3, 6, 0.5);
  ring('research', 2, 7, 2.1);
  ring('education', 2, 10.5, 0.8);
  ring('contact', 2, 8, 2.4);
  BRIDGES.forEach(b => list.push({
    x: (b.from.x + b.to.x) / 2,
    y: (b.from.y + b.to.y) / 2 + 1.3,
    z: (b.from.z + b.to.z) / 2,
  }));
  STONES.forEach(s => list.push({ x: s.x, y: s.y + 1.4, z: s.z }));
  // floating ones that need a jump pad or a double jump
  list.push({ x: -9, y: 6.5, z: 2 });
  list.push({ x: -35.7, y: 7.9, z: -17.9 });
  list.push({ x: 46, y: 9.5, z: -66 });
  return list.map((p, i) => ({ ...p, id: `shard-${i}` }));
})();

export const KILL_Y = -24;

// Name letters at spawn — a row with a gap for the path north.
export const NAME_ROW = { z: -7, gap: 1.7, size: 1.5, spacing: 1.18, words: ['SUSHANT', 'ARYAL'] };
