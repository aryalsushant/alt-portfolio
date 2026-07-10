import React from 'react';
import { Link } from 'react-router-dom';
import useAppliedTheme from '../hooks/useAppliedTheme';

export default function Home() {
  useAppliedTheme();

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center gap-6">
      <h1 className="font-orbitron text-3xl">SUSHANT ARYAL</h1>
      <div className="flex gap-4">
        <Link to="/interactive" className="text-accent underline">Interactive Portfolio</Link>
        <Link to="/classic" className="text-accent underline">Classic Portfolio</Link>
      </div>
    </div>
  );
}
