import React, { useEffect, useRef, useState } from 'react';

export default function CursorGlow() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -200, y: -200 });
  const target = useRef({ x: -200, y: -200 });
  const rafRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    setMounted(true);
    document.body.classList.add('cursor-custom');

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        setHovering(true);
      }
    };

    const onOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select, label')) {
        setHovering(false);
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      const p = pos.current;
      const t = target.current;
      p.x = lerp(p.x, t.x, 0.13);
      p.y = lerp(p.y, t.y, 0.13);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${t.x}px, ${t.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('cursor-custom');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-[width,height,background] duration-150 hidden lg:block"
        style={{
          width: hovering ? 8 : 6,
          height: hovering ? 8 : 6,
          background: '#00F5FF',
          boxShadow: '0 0 6px 2px rgba(0,245,255,0.8)',
        }}
      />
      {/* Glow ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full hidden lg:block"
        style={{
          width: hovering ? 52 : 32,
          height: hovering ? 52 : 32,
          border: `1.5px solid rgba(0,245,255,${hovering ? 0.7 : 0.35})`,
          background: hovering ? 'rgba(0,245,255,0.06)' : 'transparent',
          boxShadow: hovering ? '0 0 20px 4px rgba(0,245,255,0.2)' : 'none',
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background 0.2s ease',
        }}
      />
    </>
  );
}
