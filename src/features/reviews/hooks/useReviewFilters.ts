import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import type { Review } from '@/types/review';

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
export type DateMode = 'single' | 'range';
/** `text` matches the literal ending typed in; the rest match a whole category of ending. */
export type EndsWithMode = 'text' | 'emoji' | 'number' | 'symbol' | 'letter';

export interface ReviewFilterState {
  search: string;
  endsWith: string;
  endsWithMode: EndsWithMode;
  minRating: number;
  maxRating: number;
  dateMode: DateMode;
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
  endsWith: '',
  endsWithMode: 'text',
  minRating: 1,
  maxRating: 5,
  dateMode: 'single',
  dateFrom: null,
  dateTo: null,
  language: 'all',
  version: 'all',
  developerReply: 'any',
  bookmarkedOnly: false,
  sortBy: 'newest',
};

const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Review timestamps arrive as UTC ISO strings but are rendered in the viewer's timezone, so the day
 * boundaries have to be built locally too — `new Date('2026-07-17')` is UTC midnight, which shifts
 * the window by the UTC offset and pulls in neighbouring days while dropping matching ones.
 */
function localDayBounds(value: string): { start: number; end: number } | null {
  const match = DATE_INPUT_PATTERN.exec(value);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  if (Number.isNaN(start.getTime())) return null;
  return { start: start.getTime(), end: new Date(year, month - 1, day, 23, 59, 59, 999).getTime() };
}

/** In `single` mode both bounds come from `dateFrom`, so one picked day matches exactly that day. */
function resolveDateRange(filters: ReviewFilterState): { fromTime: number | null; toTime: number | null } {
  const from = filters.dateFrom ? localDayBounds(filters.dateFrom) : null;
  const toValue = filters.dateMode === 'single' ? filters.dateFrom : filters.dateTo;
  const to = toValue ? localDayBounds(toValue) : null;
  return { fromTime: from?.start ?? null, toTime: to?.end ?? null };
}

/**
 * Variation selectors, joiners and skin-tone modifiers make visually related emoji compare unequal
 * (heart U+2764 vs U+2764 U+FE0F, thumbs-up with and without a tone). They are stripped from both
 * the review text and the term the user typed, so a bare emoji matches its decorated variants.
 */
const EMOJI_MODIFIERS = /[\p{Variation_Selector}\p{Emoji_Modifier}\u{200B}-\u{200D}\u{2060}]/gu;

function normalizeSuffix(value: string): string {
  return value.replace(EMOJI_MODIFIERS, '').trim().toLowerCase();
}

/**
 * Category endings, for "show me everything that trails off in a number" rather than one exact
 * ending. Free text already covers literals — "$500", "!!!", "ever" and a bare emoji all work as
 * plain suffixes — so these only cover what a literal cannot express.
 */
const ENDS_WITH_PATTERNS: Record<Exclude<EndsWithMode, 'text'>, RegExp> = {
  emoji: /\p{Extended_Pictographic}$/u,
  number: /\p{Nd}$/u,
  symbol: /[\p{P}\p{S}]$/u,
  letter: /\p{L}$/u,
};

function matchesEnding(text: string, mode: EndsWithMode, suffix: string): boolean {
  const normalized = normalizeSuffix(text);
  if (!normalized) return false;
  if (mode === 'text') return suffix ? normalized.endsWith(suffix) : true;
  // a category and a literal combine: "ends with a number" AND "ends with 5"
  if (suffix && !normalized.endsWith(suffix)) return false;
  return ENDS_WITH_PATTERNS[mode].test(normalized);
}

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
  const debouncedEndsWith = useDebounce(filters.endsWith, 200);

  const languages = useMemo(() => [...new Set(reviews.map((r) => r.language))].sort(), [reviews]);
  const versions = useMemo(
    () => [...new Set(reviews.map((r) => r.version).filter((v): v is string => Boolean(v)))].sort(),
    [reviews],
  );

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const suffix = normalizeSuffix(debouncedEndsWith);
    const endingActive = Boolean(suffix) || filters.endsWithMode !== 'text';
    const { fromTime, toTime } = resolveDateRange(filters);
    const hasDateFilter = fromTime !== null || toTime !== null;

    const result = reviews.filter((r) => {
      if (r.score < filters.minRating || r.score > filters.maxRating) return false;
      if (filters.language !== 'all' && r.language !== filters.language) return false;
      if (filters.version !== 'all' && r.version !== filters.version) return false;
      if (filters.developerReply === 'with' && !r.replyText) return false;
      if (filters.developerReply === 'without' && r.replyText) return false;
      if (filters.bookmarkedOnly && !bookmarks.has(r.id)) return false;

      if (hasDateFilter) {
        const time = new Date(r.date).getTime();
        if (Number.isNaN(time)) return false;
        if (fromTime !== null && time < fromTime) return false;
        if (toTime !== null && time > toTime) return false;
      }

      if (endingActive && !matchesEnding(r.text, filters.endsWithMode, suffix)) return false;

      if (query) {
        const haystack = `${r.text} ${r.userName} ${r.version ?? ''} ${r.replyText ?? ''}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    return sortReviews(result, filters.sortBy);
  }, [reviews, bookmarks, filters, debouncedSearch, debouncedEndsWith]);

  const activeFilterCount = useMemo(() => {
    const { fromTime, toTime } = resolveDateRange(filters);
    let count = 0;
    if (filters.minRating !== DEFAULT_FILTERS.minRating || filters.maxRating !== DEFAULT_FILTERS.maxRating) count++;
    if (fromTime !== null || toTime !== null) count++;
    if (filters.endsWith.trim() || filters.endsWithMode !== 'text') count++;
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
