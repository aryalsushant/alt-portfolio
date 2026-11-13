import { useEffect, useRef } from 'react';

// Adds `.visible` once the element scrolls into view (see .reveal in index.css).
export default function useReveal(rootMargin = '-60px') {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { el.classList.add('visible'); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return ref;
}
