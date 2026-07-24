import { useRef } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { MessageCircleOff } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import type { Review } from '@/types/review';

export function ReviewList({
  reviews,
  query,
  bookmarks,
  onToggleBookmark,
}: {
  reviews: Review[];
  query: string;
  bookmarks: Set<string>;
  onToggleBookmark: (id: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: reviews.length,
    estimateSize: () => 220,
    overscan: 6,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    gap: 16,
  });

  if (reviews.length === 0) {
    return (
      <div className="glass flex flex-col items-center justify-center rounded-2xl py-16 text-center">
        <MessageCircleOff className="mb-3 size-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No reviews match your filters</p>
        <p className="mt-1 text-xs text-muted-foreground">Try widening the rating range or clearing the search.</p>
      </div>
    );
  }

  const items = virtualizer.getVirtualItems();

  return (
    <div ref={listRef}>
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        {items.map((virtualItem) => {
          const review = reviews[virtualItem.index];
          if (!review) return null;
          return (
            <div
              key={review.id}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{ transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)` }}
            >
              <ReviewCard
                review={review}
                query={query}
                isBookmarked={bookmarks.has(review.id)}
                onToggleBookmark={() => onToggleBookmark(review.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
