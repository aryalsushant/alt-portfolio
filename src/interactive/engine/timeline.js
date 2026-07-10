import { invLerp, sampleKeys } from './math';

// ---------------------------------------------------------------
// Single source of truth for the whole ride.
// Scroll positions are in vh (1vh = viewportHeight / 100 px).
// Camera X is in vw of world space, camera Y in vh of world space.
// ---------------------------------------------------------------

export const SEG = {
  splash:   [0, 100],
  walk1:    [100, 220],
  level1:   [220, 520],
  bridge:   [520, 640],
  bungee:   [640, 800],
  skills:   [800, 1140],
  plane:    [1140, 1280],
  exp:      [1280, 1640],
  edu:      [1640, 1900],
  projects: [1900, 2260],
  climb:    [2260, 2500],
  ending:   [2500, 2600],
};

export const TOTAL_VH = 2600;

// 0..1 progress within a named segment, given scroll in vh.
export const seg = (name, yVh) => invLerp(SEG[name][0], SEG[name][1], yVh);

// Camera keyframes: [scrollVh, camX(vw), camY(vh)]
export const CAM_KEYS = [
  [0, 0, 0],
  [100, 0, 0],
  [220, 120, 0],
  [520, 320, 0],
  [640, 420, 0],
  [800, 420, 160],
  [1140, 640, 160],
  [1280, 740, 0],
  [1640, 980, 0],
  [1900, 1140, 0],
  [2260, 1360, 0],
  [2500, 1480, -140],
  [2600, 1490, -144],
];

// Night amount keyframes: [scrollVh, night 0..1]
export const NIGHT_KEYS = [
  [0, 0.35],   // dawn
  [90, 0],     // day
  [520, 0],
  [670, 0.6],  // dusk on the bridge
  [800, 1],    // night over the river
  [1130, 1],
  [1300, 0],   // plane brings the morning
  [1860, 0],
  [2150, 0.55],
  [2320, 1],   // night on the mountain
  [2600, 1],
];

export const cameraAt = yVh => {
  const [x, y] = sampleKeys(CAM_KEYS, yVh);
  return { camX: x, camY: y };
};

// Ground obstacles the robot hops over while walking. Each entry is the
// scroll position (vh) at which the robot is directly above the rock;
// the hop arc spans ±JUMP_SPAN vh of scroll around it.
export const JUMPS = [170, 380, 560, 1780, 2050];
export const JUMP_SPAN = 14;
// World X of the obstacle under a given jump (robot walks at ~40vw screen).
export const jumpObstacleX = yJ => cameraAt(yJ).camX + 40.3;

export const nightAt = yVh => sampleKeys(NIGHT_KEYS, yVh)[0];

// Robot behavioural state, derived from RAW scroll (not smoothed) so
// state flips land exactly on segment boundaries.
export function robotStateFor(yVh) {
  if (yVh < SEG.splash[1]) return 'idle';
  if (yVh < SEG.bridge[1]) return 'walking';
  if (yVh < SEG.bungee[1]) return 'bungee';
  if (yVh < SEG.skills[1]) return 'hanging';
  if (yVh < SEG.plane[1]) return 'plane';
  if (yVh < SEG.projects[1]) return 'walking';
  if (yVh < SEG.climb[1]) return 'climbing';
  if (yVh < SEG.ending[0] + 40) return 'jumping';
  return 'napping';
}

// Current level label for the HUD.
export function levelFor(yVh) {
  if (yVh < SEG.level1[0]) return { n: 0, label: 'START' };
  if (yVh < SEG.skills[0]) return { n: 1, label: 'ABOUT' };
  if (yVh < SEG.exp[0]) return { n: 2, label: 'SKILLS' };
  if (yVh < SEG.edu[0]) return { n: 3, label: 'EXPERIENCE' };
  if (yVh < SEG.projects[0]) return { n: 4, label: 'EDUCATION' };
  if (yVh < SEG.climb[0]) return { n: 5, label: 'PROJECTS' };
  if (yVh < SEG.ending[0]) return { n: 6, label: 'AWARDS' };
  return { n: 7, label: 'CONTACT' };
}
