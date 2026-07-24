import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export function useCountUp(target: number, durationMs = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: durationMs / 1000,
      ease: 'easeOut',
      onUpdate: (latest) => setValue(latest),
    });

    // On StrictMode's mount→cleanup→remount, cleanup stops the first run and the
    // second effect starts a fresh animation — so we intentionally do NOT guard
    // with a ref (that would leave the value stuck at 0 when the first run is
    // cancelled before its first frame).
    return () => controls.stop();
  }, [target, durationMs]);

  return value;
}
