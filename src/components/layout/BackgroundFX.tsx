import { motion } from 'framer-motion';

const blobs = [
  { className: 'left-[-10%] top-[-10%] size-[38rem] bg-blue-600/25', duration: 22, x: [0, 60, -20, 0], y: [0, 40, 80, 0] },
  { className: 'right-[-15%] top-[10%] size-[34rem] bg-sky-400/20', duration: 26, x: [0, -50, 30, 0], y: [0, 60, -30, 0] },
  { className: 'left-[20%] bottom-[-20%] size-[30rem] bg-indigo-500/20', duration: 30, x: [0, 40, -60, 0], y: [0, -50, 20, 0] },
];

export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      <div className="bg-grid-pattern absolute inset-0 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)]" />
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[110px] ${blob.className}`}
          animate={{ x: blob.x, y: blob.y }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
