import React from 'react';
import SceneBox from './SceneBox';

export default function Splash() {
  return (
    <SceneBox x={6} w={80} y={16}>
      <p className="ip-eyebrow" style={{ marginBottom: '2vh' }}>New game · Insert scroll to play</p>
      <h1 className="ip-splash-title">
        Interactive Portfolio<br />
        of <span style={{ color: 'var(--ip-amber)' }}>Sushant Aryal</span>
      </h1>
      <div style={{ marginTop: '6vh' }}>
        <span className="ip-scroll-hint">▼ scroll down to start walking</span>
      </div>
    </SceneBox>
  );
}
