// Quality tiers. "auto" picks a starting tier from device hints, then the
// in-game PerformanceMonitor moves it up/down based on measured frame rate.

export const TIERS = ['low', 'medium', 'high'];

export const TIER_SETTINGS = {
  low: { dpr: [0.75, 1.25], shadows: false, shadowSize: 1024, fireflies: 90, clouds: 8 },
  medium: { dpr: [1, 1.5], shadows: true, shadowSize: 1024, fireflies: 180, clouds: 14 },
  high: { dpr: [1, 2], shadows: true, shadowSize: 2048, fireflies: 280, clouds: 20 },
};

export function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 1)
  );
}

export function detectTier() {
  try {
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    const touch = isTouchDevice();
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    let renderer = '';
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    const r = renderer.toLowerCase();
    const weakGpu = /(mali-[gt][0-9]{2}\b|adreno \(tm\) [3-5]|powervr|intel\(r\) (hd|uhd) graphics [0-9]{3}\b|swiftshader|llvmpipe)/.test(r);
    if (weakGpu || cores <= 2 || mem <= 2) return 'low';
    if (touch) return cores >= 6 && /apple|adreno \(tm\) [6-9]/.test(r) ? 'medium' : 'low';
    if (/apple m|nvidia|geforce|radeon|rtx|arc/.test(r) || cores >= 8) return 'high';
    return 'medium';
  } catch {
    return 'medium';
  }
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}
