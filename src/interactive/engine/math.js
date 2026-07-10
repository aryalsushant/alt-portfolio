// Small math helpers for the scroll engine. All pure.

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => (b === a ? 0 : clamp((v - a) / (b - a), 0, 1));

export const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
export const easeInCubic = t => t * t * t;
export const easeOutBack = t => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
export const smoothstep = t => t * t * (3 - 2 * t);

// Map v from [a,b] to [c,d], clamped, with optional easing fn.
export const mapRange = (v, a, b, c, d, ease) => {
  let t = invLerp(a, b, v);
  if (ease) t = ease(t);
  return lerp(c, d, t);
};

// Piecewise-linear interpolation over keyframes [[x, v1, v2, ...], ...].
// Returns array of interpolated values (minus the x). Keys must be x-sorted.
export function sampleKeys(keys, x) {
  if (x <= keys[0][0]) return keys[0].slice(1);
  const last = keys[keys.length - 1];
  if (x >= last[0]) return last.slice(1);
  for (let i = 1; i < keys.length; i++) {
    if (x <= keys[i][0]) {
      const [xa, ...va] = keys[i - 1];
      const [xb, ...vb] = keys[i];
      const t = smoothstep(invLerp(xa, xb, x));
      return va.map((v, j) => lerp(v, vb[j], t));
    }
  }
  return last.slice(1);
}
