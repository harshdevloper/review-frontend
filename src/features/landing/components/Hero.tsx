import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { UrlInputForm } from './UrlInputForm';

export function Hero({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (url: string) => void;
  isSubmitting: boolean;
}) {
  return (
    <section className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground"
      >
        <Sparkles className="size-3.5 text-secondary" />
        AI-powered Play Store review analytics
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05 }}
        className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
      >
        Analyze <span className="text-gradient">Google Play Reviews</span> in Seconds
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15 }}
        className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
      >
        Paste any Google Play Store URL to instantly fetch reviews, visualize customer feedback,
        discover trends, and export everything to Excel.
      </motion.p>

      <div className="mt-10 w-full">
        <UrlInputForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </div>
    </section>
  );
}
