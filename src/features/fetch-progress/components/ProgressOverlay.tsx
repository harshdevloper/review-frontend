import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Wifi, PackageSearch, DownloadCloud, BarChart3, LayoutDashboard, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { FetchStageEvent, FetchStageName } from '@/api/reviews.api';

const STAGES: { key: FetchStageName; label: string; icon: typeof Wifi }[] = [
  { key: 'connecting', label: 'Connecting to Google Play', icon: Wifi },
  { key: 'app-details', label: 'Fetching application details', icon: PackageSearch },
  { key: 'downloading-reviews', label: 'Downloading reviews', icon: DownloadCloud },
  { key: 'analytics', label: 'Generating analytics', icon: BarChart3 },
  { key: 'preparing', label: 'Preparing dashboard', icon: LayoutDashboard },
];

function SkeletonPreview() {
  return (
    <div className="grid grid-cols-2 gap-4 opacity-40 sm:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="shimmer glass h-20 rounded-2xl" />
      ))}
    </div>
  );
}

export function ProgressOverlay({ stage }: { stage: FetchStageEvent | null }) {
  const activeIndex = stage ? STAGES.findIndex((s) => s.key === stage.stage) : -1;
  const progress = stage?.progress ?? 4;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-16"
    >
      <div className="glass-strong w-full max-w-xl rounded-3xl p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-sky-400 shadow-lg shadow-blue-500/30"
          >
            <Sparkles className="size-7 text-white" />
          </motion.span>

          <AnimatePresence mode="wait">
            <motion.h2
              key={stage?.message ?? 'init'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-lg font-medium text-foreground sm:text-xl"
            >
              {stage?.message ?? 'Starting up...'}
            </motion.h2>
          </AnimatePresence>

          <div className="mt-6 w-full">
            <Progress value={progress} className="h-2" />
            <p className="mt-2 text-xs text-muted-foreground">{Math.round(progress)}%</p>
          </div>

          <ul className="mt-8 flex w-full flex-col gap-2.5">
            {STAGES.map((s, i) => {
              const isDone = i < activeIndex || (i === activeIndex && s.key !== stage?.stage);
              const isActive = i === activeIndex;
              const Icon = s.icon;
              return (
                <li
                  key={s.key}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'border-primary/30 bg-primary/10 text-foreground'
                      : isDone
                        ? 'border-transparent text-muted-foreground'
                        : 'border-transparent text-muted-foreground/50'
                  }`}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                      isDone ? 'bg-emerald-500/20 text-emerald-400' : isActive ? 'bg-primary/20 text-primary' : 'bg-white/5'
                    }`}
                  >
                    {isDone ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                  </span>
                  <span className="text-left">{s.label}</span>
                  {isActive && s.key === 'downloading-reviews' && stage?.reviewCount ? (
                    <span className="ml-auto font-mono text-xs text-primary">{stage.reviewCount}</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-10 hidden px-8 sm:block">
        <SkeletonPreview />
      </div>
    </motion.div>
  );
}
