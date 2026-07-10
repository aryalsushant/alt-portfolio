import React from 'react';

// World geometry (all positions in vw / vh world units):
//   ground line at Y=78 · gorge between X 435 and 745 · river surface Y=232
//   mountain rises from X~1400 (Y=78) to a summit plateau at Y=-60

export const GORGE = { left: 435, right: 745 };
export const RIVER_Y = 232;

// Point on the mountain slope for u in [0,1] (base → summit edge).
export const slopePoint = u => ({ x: 1400 + 116 * u, y: 78 - 138 * u });

export default function Terrain() {
  return (
    <>
      {/* river fills the gorge floor */}
      <div
        className="ip-river"
        style={{ left: '430vw', top: `${RIVER_Y}vh`, width: '320vw', height: '40vh' }}
      />

      {/* left landmass (splash → bridge) */}
      <div className="ip-ground" style={{ left: '-40vw', top: '78vh', width: '475vw', height: '330vh' }} />
      {/* right landmass (experience → mountain) */}
      <div className="ip-ground" style={{ left: '745vw', top: '78vh', width: '920vw', height: '330vh' }} />

      {/* suspension bridge over the gorge */}
      <div className="ip-bridge-deck" style={{ left: '425vw', top: '74.5vh', width: '330vw', height: '3vh' }} />
      <div className="ip-bridge-tower" style={{ left: '470.4vw', top: '40vh', width: '1.6vw', height: '200vh' }} />
      <div className="ip-bridge-tower" style={{ left: '706.4vw', top: '40vh', width: '1.6vw', height: '200vh' }} />
      <svg
        className="ip-bridge-cables"
        style={{ left: '425vw', top: '38vh', width: '330vw', height: '40vh' }}
        viewBox="0 0 3300 400"
        preserveAspectRatio="none"
      >
        {/* main catenaries: deck ends → tower tops → mid-dip → far side */}
        <path d="M0 360 Q230 20 462 20 Q1050 20 1650 330 Q2250 20 2822 20 Q3060 20 3300 360" />
        {/* hangers */}
        {Array.from({ length: 22 }, (_, i) => {
          const x = 520 + i * 105;
          // rough catenary height between the towers
          const mid = 1642;
          const t = Math.abs(x - mid) / 1180;
          const yTop = 330 - (330 - 20) * t * t;
          return <line key={i} x1={x} y1={yTop} x2={x} y2={365} />;
        })}
      </svg>

      {/* the awards mountain */}
      <svg
        style={{ position: 'absolute', left: '1380vw', top: '-70vh', width: '260vw', height: '160vh' }}
        viewBox="0 0 2600 1600"
        preserveAspectRatio="none"
      >
        <path d="M200 1480 L1360 100 L1800 100 L2400 1480 Z" fill="#4e5a84" />
        <path d="M200 1480 L1360 100 L1580 100 L560 1480 Z" fill="#5d6a96" />
        {/* snow cap */}
        <path d="M1360 100 L1800 100 L1860 180 L1760 160 L1660 210 L1540 160 L1430 200 L1310 165 Z"
          fill="#eef2fb" opacity="0.92" />
        {/* plateau surface */}
        <rect x="1340" y="88" width="480" height="24" rx="10" fill="#6b78a6" />
      </svg>
    </>
  );
}
