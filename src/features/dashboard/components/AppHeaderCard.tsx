import { motion } from 'framer-motion';
import { ExternalLink, Tag, User } from 'lucide-react';
import { StarRating } from '@/components/layout/StarRating';
import { formatFullNumber } from '@/lib/format';
import type { AppDetails } from '@/types/app';

export function AppHeaderCard({ app }: { app: AppDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-strong flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:p-7"
    >
      <img
        src={app.icon}
        alt={`${app.title} icon`}
        className="size-20 shrink-0 rounded-2xl object-cover shadow-lg shadow-black/30 ring-1 ring-white/10"
        width={80}
        height={80}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{app.title}</h1>
          <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs text-muted-foreground">
            <Tag className="size-3" />
            {app.category}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="size-3.5" />
            {app.developer}
          </span>
          <span className="flex items-center gap-1.5">
            <StarRating score={app.score} size="xs" />
            {app.score.toFixed(1)} ({formatFullNumber(app.ratings)} ratings)
          </span>
        </div>
        <p className="mt-2.5 line-clamp-2 max-w-2xl text-sm text-muted-foreground/80">{app.summary}</p>
      </div>
      <a
        href={app.url}
        target="_blank"
        rel="noreferrer"
        className="glass inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10 sm:self-center"
      >
        View on Play Store <ExternalLink className="size-3.5" />
      </a>
    </motion.div>
  );
}
