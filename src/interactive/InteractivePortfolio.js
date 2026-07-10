import React from 'react';
import { Link } from 'react-router-dom';

export default function InteractivePortfolio() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center gap-4">
      <p className="font-mono text-accent text-sm tracking-[0.3em] uppercase">Under construction</p>
      <Link to="/" className="text-accent underline">← Back home</Link>
    </div>
  );
}
