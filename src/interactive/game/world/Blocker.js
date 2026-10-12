import React, { useEffect, useRef } from 'react';
import { cameraBlockers } from '../core/events';

// Wraps a collider and registers it as solid for the follow camera.
// (react-three-rapier only forwards object refs, so this owns the ref.)
export default function Blocker({ shape: Shape, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return undefined;
    const h = c.handle;
    cameraBlockers.add(h);
    return () => cameraBlockers.delete(h);
  }, []);
  return <Shape ref={ref} {...props} />;
}
