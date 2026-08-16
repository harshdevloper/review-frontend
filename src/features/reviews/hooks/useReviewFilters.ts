import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  filterReviews,
  type DateMode,
  type EndsWithMode,
  type ReviewFilterState,
  type SortOption,
} from '../lib/reviewFilters';
import type { Review } from '@/types/review';

export { DEFAULT_FILTERS };
export type { DateMode, EndsWithMode, ReviewFilterState, SortOption };

export function useReviewFilters(reviews: Review[], bookmarks: Set<string>) {
  const [filters, setFilters] = useState<ReviewFilterState>(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(filters.search, 200);
  const debouncedEndsWith = useDebounce(filters.endsWith, 200);

  const languages = useMemo(() => [...new Set(reviews.map((review) => review.language))].sort(), [reviews]);
  const versions = useMemo(
    () =>
      [...new Set(reviews.map((review) => review.version).filter((version): version is string => Boolean(version)))].sort(),
    [reviews],
  );

  const filtered = useMemo(
    () => filterReviews(reviews, bookmarks, filters, debouncedSearch, debouncedEndsWith),
    [reviews, bookmarks, filters, debouncedSearch, debouncedEndsWith],
  );
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

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
