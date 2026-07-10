import { createContext, useContext, useEffect, useRef } from 'react';

// One requestAnimationFrame loop drives everything. Subscribers receive a
// shared mutable state object and write straight to DOM refs — no React
// state is touched per frame.
//
// state = { y, smoothY, vy, vw, vh, yVh } — yVh/smoothYVh are scroll in vh units.

export function createScrollDriver(smoothing = 0.12) {
  const state = {
    y: 0, smoothY: 0, vy: 0,
    vw: window.innerWidth, vh: window.innerHeight,
    yVh: 0, smoothYVh: 0,
  };
  const subs = new Set();
  let raf = 0;
  let running = false;

  const onResize = () => {
    state.vw = window.innerWidth;
    state.vh = window.innerHeight;
  };

  function loop() {
    const y = window.scrollY || 0;
    state.vy = y - state.y;
    state.y = y;
    state.smoothY += (y - state.smoothY) * smoothing;
    if (Math.abs(y - state.smoothY) < 0.1) state.smoothY = y;
    const vh100 = state.vh / 100;
    state.yVh = y / vh100;
    state.smoothYVh = state.smoothY / vh100;
    subs.forEach(cb => cb(state));
    raf = requestAnimationFrame(loop);
  }

  return {
    state,
    subscribe(cb) {
      subs.add(cb);
      cb(state);
      return () => subs.delete(cb);
    },
    start() {
      if (running) return;
      running = true;
      window.addEventListener('resize', onResize, { passive: true });
      onResize();
      raf = requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    },
  };
}

export const ScrollContext = createContext(null);

export const useScrollDriver = () => useContext(ScrollContext);

// Subscribe a per-frame callback. cb(state) must be cheap and only mutate refs.
export function useFrame(cb, deps = []) {
  const driver = useContext(ScrollContext);
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    if (!driver) return undefined;
    return driver.subscribe(s => cbRef.current(s));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driver, ...deps]);
}
