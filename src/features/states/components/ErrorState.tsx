import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CloudAlert, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FetchErrorEvent } from '@/api/reviews.api';

export function ErrorState({ error, onRetry }: { error: FetchErrorEvent; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center"
    >
      <span className="glass-strong mb-6 flex size-20 items-center justify-center rounded-3xl">
        <CloudAlert className="size-9 text-destructive" />
      </span>
      <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{error.message}</p>
      {error.suggestion ? (
        <p className="mt-1 max-w-md text-sm text-muted-foreground/70">{error.suggestion}</p>
      ) : null}
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={onRetry} className="rounded-xl">
          <RotateCw className="size-4" /> Try again
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/">Start over</Link>
        </Button>
      </div>
    </motion.div>
  );
}
