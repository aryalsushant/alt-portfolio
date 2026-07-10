import React from 'react';
import SceneBox from '../scenes/SceneBox';
import { JUMPS, jumpObstacleX } from '../engine/timeline';

// Boulders sitting on the grass line — the robot hops over each one.
function Rock({ x, alt }) {
  return (
    <SceneBox x={x - 2.5} w={5} y={70.5} h={6.5}>
      <svg viewBox="0 0 100 70" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        <path
          d="M8 70 L4 46 Q10 24 30 16 L52 6 Q76 8 88 26 L97 50 L94 70 Z"
          fill={alt ? '#7d8296' : '#6b7088'}
        />
        <path
          d="M8 70 L4 46 Q10 24 30 16 L52 6 Q60 18 50 34 Q36 52 30 70 Z"
          fill={alt ? '#969cb2' : '#848aa4'}
        />
        <path d="M52 6 Q76 8 88 26 L74 30 Q60 20 52 6 Z" fill="#aab0c6" opacity=".8" />
      </svg>
    </SceneBox>
  );
}

export default function Obstacles() {
  return (
    <>
      {JUMPS.map((yJ, i) => (
        <Rock key={yJ} x={jumpObstacleX(yJ)} alt={i % 2 === 1} />
      ))}
    </>
  );
}
