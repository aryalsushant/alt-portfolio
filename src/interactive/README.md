# Interactive portfolio — "The Archipelago"

A third-person 3D game at `/interactive`. You steer the robot around floating islands, and each island holds part of the portfolio. The rest of the site doesn't load any of this: the route is lazy-loaded from `App.js`.

**Stack:** three.js 0.170, @react-three/fiber 8, drei 9, @react-three/rapier 1 (physics), @react-three/postprocessing 2 and framer-motion (UI). These are the last major versions that support React 18; don't upgrade to fiber 9, drei 10 or rapier 2 without also moving the app to React 19.

## Where things live

| Path | What |
| --- | --- |
| `content.js` | **All copy.** Edit text, projects and links here. Never add the phone number. |
| `game/core/layout.js` | Positions of islands, bridges, zones, interactables, jump pads, stones and shards. |
| `game/core/store.js` | UI state (`useGame`) and persisted progress, plus `runtime`, the shared per-frame data. |
| `game/core/events.js` | Event bus (jump, land, collect, …) and the set of colliders the camera treats as solid. |
| `game/player/Player.js` | Character controller (Rapier KCC, fixed 60 Hz step, interpolated). Tuning lives in `TUNE`. |
| `game/player/Robot.js` | The robot model and its code-driven animation. |
| `game/player/FollowCamera.js` | Orbit follow camera, collision, title-screen orbit. |
| `game/world/*` | Sky, cloud sea, islands, bridges, foliage, landmarks and gameplay objects. |
| `game/fx/*` | Particles, post-processing stack. |
| `game/audio/sound.js` | Sound effects and music, all synthesized with Web Audio. |
| `game/ui/*` | Title screen, HUD, minimap, panels, map, pause menu, touch controls. |
| `StaticFallback.js` | Shown when there's no WebGL or the game crashes. |

## Common edits

- **Add a project:** add an entry to `PROJECTS` in `content.js`, then add an angle to `CABINET_ANGLES` in `layout.js`. Keep it away from bridge mouths. Optional: put a screenshot in `/public` and set `image`.
- **Add an island:** add it to `ISLANDS` and `ZONES`, connect it in `BRIDGE_PAIRS`, then place its landmark in `world/Landmarks.js`.
- **Change the feel:** edit `TUNE` in `Player.js`. For example, raise `coyote` or `jumpBuffer` to make jumps more forgiving.

## Quality tiers

`core/quality.js` picks low, medium or high from device hints. drei's `PerformanceMonitor` then steps the tier down or up based on measured FPS. Players can lock a tier from the pause menu. Low tier turns off the post-processing composer and real-time shadows; the robot's blob shadow stays.

## Dev handle

In development builds, `window.__gx` exposes `{ getState, setState, runtime, scene, gl }` for automated play-testing. For example, `__gx.runtime.teleport = { x, y, z, yaw }` moves the robot. Production builds strip it out.
