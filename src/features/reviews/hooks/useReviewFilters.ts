import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import type { Review } from '@/types/review';

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';

export interface ReviewFilterState {
  search: string;
  minRating: number;
  maxRating: number;
  dateFrom: string | null;
  dateTo: string | null;
  language: string;
  version: string;
  developerReply: 'any' | 'with' | 'without';
  bookmarkedOnly: boolean;
  sortBy: SortOption;
}

export const DEFAULT_FILTERS: ReviewFilterState = {
  search: '',
  minRating: 1,
  maxRating: 5,
  dateFrom: null,
  dateTo: null,
  language: 'all',
  version: 'all',
  developerReply: 'any',
  bookmarkedOnly: false,
  sortBy: 'newest',
};

function sortReviews(reviews: Review[], sortBy: SortOption): Review[] {
  const sorted = [...reviews];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'highest':
      return sorted.sort((a, b) => b.score - a.score);
    case 'lowest':
      return sorted.sort((a, b) => a.score - b.score);
    case 'helpful':
      return sorted.sort((a, b) => b.thumbsUp - a.thumbsUp);
    default:
      return sorted;
  }
}

export function useReviewFilters(reviews: Review[], bookmarks: Set<string>) {
  const [filters, setFilters] = useState<ReviewFilterState>(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 200);

  const languages = useMemo(() => [...new Set(reviews.map((r) => r.language))].sort(), [reviews]);
  const versions = useMemo(
    () => [...new Set(reviews.map((r) => r.version).filter((v): v is string => Boolean(v)))].sort(),
    [reviews],
  );

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const fromTime = filters.dateFrom ? new Date(filters.dateFrom).getTime() : null;
    const toTime = filters.dateTo ? new Date(filters.dateTo).getTime() + 86_400_000 - 1 : null;

    const result = reviews.filter((r) => {
      if (r.score < filters.minRating || r.score > filters.maxRating) return false;
      if (filters.language !== 'all' && r.language !== filters.language) return false;
      if (filters.version !== 'all' && r.version !== filters.version) return false;
      if (filters.developerReply === 'with' && !r.replyText) return false;
      if (filters.developerReply === 'without' && r.replyText) return false;
      if (filters.bookmarkedOnly && !bookmarks.has(r.id)) return false;

      const time = new Date(r.date).getTime();
      if (fromTime !== null && time < fromTime) return false;
      if (toTime !== null && time > toTime) return false;

      if (query) {
        const haystack = `${r.text} ${r.userName} ${r.version ?? ''} ${r.replyText ?? ''}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    return sortReviews(result, filters.sortBy);
  }, [reviews, bookmarks, filters, debouncedSearch]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minRating !== DEFAULT_FILTERS.minRating || filters.maxRating !== DEFAULT_FILTERS.maxRating) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.language !== 'all') count++;
    if (filters.version !== 'all') count++;
    if (filters.developerReply !== 'any') count++;
    if (filters.bookmarkedOnly) count++;
    return count;
  }, [filters]);

  return {
    filters,
    setFilters,
    filtered,
    languages,
    versions,
    activeFilterCount,
    resetFilters: () => setFilters(DEFAULT_FILTERS),
    searchQuery: debouncedSearch,
  };
}
