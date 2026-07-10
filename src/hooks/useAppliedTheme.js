import { useEffect, useState } from 'react';

// Read-only theme applier for routes without their own toggle.
// Shares the same localStorage key as the classic portfolio so the
// saved preference carries across routes.
export default function useAppliedTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark];
}
