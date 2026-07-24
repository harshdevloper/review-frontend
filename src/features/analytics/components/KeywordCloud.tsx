import { motion } from 'framer-motion';
import { ChartCard } from './ChartCard';
import { SEQUENTIAL_BLUE } from '../chartTokens';
import type { KeywordPoint } from '@/types/review';

function pickStep(rankRatio: number): string {
  if (rankRatio < 0.1) return SEQUENTIAL_BLUE[100];
  if (rankRatio < 0.25) return SEQUENTIAL_BLUE[200];
  if (rankRatio < 0.5) return SEQUENTIAL_BLUE[300];
  return SEQUENTIAL_BLUE[400];
}

export function KeywordCloud({ data }: { data: KeywordPoint[] }) {
  const words = data.slice(0, 40);
  const max = Math.max(1, ...words.map((w) => w.count));
  const min = Math.min(...words.map((w) => w.count), max);

  if (words.length === 0) {
    return (
      <ChartCard title="Top Keywords" subtitle="Most common words across reviews">
        <p className="py-8 text-center text-sm text-muted-foreground">Not enough text to extract keywords yet.</p>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Top Keywords" subtitle="Most common words across reviews">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ show: { transition: { staggerChildren: 0.015 } } }}
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-2 py-4"
      >
        {words.map((word, i) => {
          const ratio = max === min ? 1 : (word.count - min) / (max - min);
          const rankRatio = i / words.length;
          const fontSize = 0.8 + ratio * 1.5;
          return (
            <motion.span
              key={word.word}
              variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
              whileHover={{ scale: 1.12 }}
              className="cursor-default font-semibold leading-none transition-colors"
              style={{ fontSize: `${fontSize}rem`, color: pickStep(rankRatio) }}
              title={`${word.word}: ${word.count} mentions`}
            >
              {word.word}
            </motion.span>
          );
        })}
      </motion.div>
    </ChartCard>
  );
}
