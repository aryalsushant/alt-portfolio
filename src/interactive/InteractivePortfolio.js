import React, { useEffect, useMemo } from 'react';
import './interactive.css';
import Game from './game/Game';
import Overlay from './game/ui/Overlay';
import StaticFallback from './StaticFallback';
import { getState, setState, runtime } from './game/core/store';
import { detectTier, hasWebGL, isTouchDevice } from './game/core/quality';

class GameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err) {
    // eslint-disable-next-line no-console
    console.error('[interactive] game crashed, showing fallback', err);
  }

  render() {
    return this.state.failed ? <StaticFallback reason="crash" /> : this.props.children;
  }
}

// Dev-only handle for automated play-testing.
if (process.env.NODE_ENV !== 'production') window.__gx = { getState, setState, runtime };

export default function InteractivePortfolio() {
  const webgl = useMemo(() => hasWebGL(), []);

  // Reset session state during the first render — before any child effect
  // (e.g. the in-canvas Ready marker) can flip the phase to 'title'.
  useMemo(() => {
    const s = getState();
    setState({
      touch: isTouchDevice(),
      tier: s.quality === 'auto' ? detectTier() : s.quality,
      phase: 'loading',
      paused: false,
      panel: null,
      mapOpen: false,
      prompt: null,
      zone: null,
      toasts: [],
      fade: 0,
    });
  }, []);

  useEffect(() => {
    // The game owns the viewport: no page scroll, rubber-banding or pinch-zoom.
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, bodyOverflow: document.body.style.overflow, overscroll: html.style.overscrollBehavior };
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    return () => {
      html.style.overflow = prev.overflow;
      document.body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.overscroll;
    };
  }, []);

  if (!webgl) return <StaticFallback reason="webgl" />;

  return (
    <GameErrorBoundary>
      <div className="gx-root">
        <Game />
        <Overlay />
      </div>
    </GameErrorBoundary>
  );
}
