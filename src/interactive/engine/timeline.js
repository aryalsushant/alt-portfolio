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

export const NAV_STOPS = [
  { id: 'start', label: 'START', yVh: 0 },
  { id: 'about-gate', label: 'LEVEL 1', yVh: 175 },
  { id: 'about-profile', label: 'ABOUT', yVh: 230 },
  { id: 'about-full-stack', label: 'FULL-STACK', yVh: 300 },
  { id: 'about-automation', label: 'AUTOMATION', yVh: 345 },
  { id: 'about-ai-ml', label: 'AI / ML', yVh: 412 },
  { id: 'about-ribbon', label: 'LOW CORTISOL', yVh: 462 },
  { id: 'bridge-rock', label: 'ROCK JUMP', yVh: 560 },
  { id: 'bungee-sign', label: 'BUNGEE', yVh: 650 },
  { id: 'skills-gate', label: 'LEVEL 2', yVh: 800 },
  { id: 'skills-header', label: 'SKILLS', yVh: 822 },
  { id: 'skills-languages-left', label: 'LANGUAGES', yVh: 850 },
  { id: 'skills-languages-right', label: 'FRAMEWORKS', yVh: 910 },
  { id: 'skills-data-ml', label: 'DATA / ML', yVh: 955 },
  { id: 'skills-tools', label: 'TOOLS', yVh: 1090 },
  { id: 'plane', label: 'PLANE', yVh: 1188 },
  { id: 'experience-gate', label: 'LEVEL 3', yVh: 1280 },
  { id: 'experience-gift-of-life', label: 'GIFT OF LIFE', yVh: 1298 },
  { id: 'experience-cornell', label: 'CORNELL TECH', yVh: 1379 },
  { id: 'experience-illumibot', label: 'ILLUMIBOT', yVh: 1460 },
  { id: 'experience-dha', label: 'DELTA HEALTH', yVh: 1541 },
  { id: 'education-gate', label: 'LEVEL 4', yVh: 1640 },
  { id: 'education-usm', label: 'USM', yVh: 1702 },
  { id: 'education-campus', label: 'EDUCATION', yVh: 1776 },
  { id: 'education-cornell', label: 'CORNELL', yVh: 1842 },
  { id: 'projects-gate', label: 'LEVEL 5', yVh: 1900 },
  { id: 'project-druglytics', label: 'DRUGLYTICS', yVh: 1973 },
  { id: 'project-swiped-in', label: 'SWIPED-IN', yVh: 2064 },
  { id: 'project-hipaapotamus', label: 'HIPAAPOTAMUS', yVh: 2156 },
  { id: 'awards-gate', label: 'LEVEL 6', yVh: 2260 },
  { id: 'award-third-place', label: 'AWARD', yVh: 2302 },
  { id: 'award-second-place', label: 'AWARD', yVh: 2358 },
  { id: 'award-first-place', label: 'AWARD', yVh: 2414 },
  { id: 'award-first-prize', label: 'AWARD', yVh: 2468 },
  { id: 'contact', label: 'CONTACT', yVh: 2506 },
];

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
