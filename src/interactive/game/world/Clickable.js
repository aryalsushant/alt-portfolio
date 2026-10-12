import React, { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { emit, on } from '../core/events';

// Every landmark is wrapped in <Clickable id="…">. Mouse clicks go through
// R3F's pointer events; on phones the touch layer sits above the canvas, so
// taps are forwarded here as 'tap' events and resolved by <TapPicker/>.

const registry = new Map(); // Object3D -> interactable id

export default function Clickable({ id, children, ...props }) {
  const ref = useRef(null);
  const { gl } = useThree();

  useEffect(() => {
    const g = ref.current;
    registry.set(g, id);
    return () => registry.delete(g);
  }, [id]);

  return (
    <group
      ref={ref}
      {...props}
      onClick={e => {
        // ignore the click that ends a camera drag
        if (e.delta > 6) return;
        e.stopPropagation();
        emit('clickInteractable', { id });
      }}
      onPointerOver={e => {
        if (e.pointerType !== 'mouse') return;
        e.stopPropagation();
        gl.domElement.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        gl.domElement.style.cursor = '';
      }}
    >
      {children}
    </group>
  );
}

export function TapPicker() {
  const { camera, scene } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const size = useThree(s => s.size);

  useEffect(
    () =>
      on('tap', ({ x, y }) => {
        ndc.set((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1);
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObjects([...registry.keys()], true);
        for (const h of hits) {
          let o = h.object;
          while (o && !registry.has(o)) o = o.parent;
          if (o) {
            emit('clickInteractable', { id: registry.get(o) });
            return;
          }
        }
      }),
    [camera, raycaster, ndc, size, scene]
  );
  return null;
}

if (process.env.NODE_ENV !== 'production') window.__gxClick = { registry, THREE };
