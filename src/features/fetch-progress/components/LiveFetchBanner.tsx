import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { FetchStageEvent } from '@/api/reviews.api';

/**
 * Shown while the dashboard is already usable but reviews are still streaming in, so the numbers
 * on screen are visibly provisional rather than silently incomplete.
 */
export function LiveFetchBanner({ reviewCount, stage }: { reviewCount: number; stage: FetchStageEvent | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-primary/20 px-4 py-2.5"
    >
      <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
      <span className="text-sm font-medium text-foreground">
        Still fetching — {reviewCount.toLocaleString()} reviews so far
      </span>
      <span className="text-xs text-muted-foreground">
        {stage?.message ?? 'Filters and charts update as more arrive.'}
      </span>
    </motion.div>
  );
}

export function AnalyticsPending() {
  return (
    <div className="glass flex items-center justify-center gap-2 rounded-2xl py-12 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Building analytics from the first reviews...
    </div>
  );
}
