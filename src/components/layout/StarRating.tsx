import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({ score, size = 'sm' }: { score: number; size?: 'xs' | 'sm' | 'md' }) {
  const rounded = Math.round(score);
  const starSize = size === 'md' ? 'size-4.5' : size === 'sm' ? 'size-3.5' : 'size-3';

  return (
    <div className="flex items-center gap-0.5" aria-label={`${score.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(starSize, i < rounded ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-muted-foreground/30')}
        />
      ))}
    </div>
  );
}
