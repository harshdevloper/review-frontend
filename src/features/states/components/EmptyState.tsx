import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({
  title = 'No reviews loaded yet',
  description = 'Paste a Play Store URL to begin.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center"
    >
      <motion.span
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="glass-strong mb-6 flex size-20 items-center justify-center rounded-3xl"
      >
        <SearchX className="size-9 text-muted-foreground" />
      </motion.span>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button asChild className="mt-6 rounded-xl">
        <Link to="/">Go to homepage</Link>
      </Button>
    </motion.div>
  );
}
