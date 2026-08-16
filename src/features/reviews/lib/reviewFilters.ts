import type { Review } from '../../../types/review';

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
export type DateMode = 'single' | 'range';
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

function localDayBounds(value: string): { start: number; end: number } | null {
  const match = DATE_INPUT_PATTERN.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const start = new Date(year, month - 1, day, 0, 0, 0, 0);

  if (
    Number.isNaN(start.getTime()) ||
    start.getFullYear() !== year ||
    start.getMonth() !== month - 1 ||
    start.getDate() !== day
  ) {
    return null;
  }
  return { start: start.getTime(), end: new Date(year, month - 1, day, 23, 59, 59, 999).getTime() };
}

function resolveDateRange(filters: ReviewFilterState): { fromTime: number | null; toTime: number | null } {
  const from = filters.dateFrom ? localDayBounds(filters.dateFrom) : null;
  const toValue = filters.dateMode === 'single' ? filters.dateFrom : filters.dateTo;
  const to = toValue ? localDayBounds(toValue) : null;
  return { fromTime: from?.start ?? null, toTime: to?.end ?? null };
}

const EMOJI_MODIFIERS = /[\p{Variation_Selector}\p{Emoji_Modifier}\u{200B}-\u{200D}\u{2060}]/gu;

function normalizeSuffix(value: string): string {
  return value.normalize('NFKC').replace(EMOJI_MODIFIERS, '').trim().toLocaleLowerCase();
}

function normalizeSearch(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

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
  if (suffix && !normalized.endsWith(suffix)) return false;
  return ENDS_WITH_PATTERNS[mode].test(normalized);
}

function dateValue(review: Review): number | null {
  const value = new Date(review.date).getTime();
  return Number.isNaN(value) ? null : value;
}

function newestFirst(a: Review, b: Review): number {
  const aTime = dateValue(a);
  const bTime = dateValue(b);
  if (aTime === null) return bTime === null ? a.id.localeCompare(b.id) : 1;
  if (bTime === null) return -1;
  return bTime - aTime || a.id.localeCompare(b.id);
}

function sortReviews(reviews: Review[], sortBy: SortOption): Review[] {
  const sorted = [...reviews];
  switch (sortBy) {
    case 'newest':
      return sorted.sort(newestFirst);
    case 'oldest':
      return sorted.sort((a, b) => {
        const aTime = dateValue(a);
        const bTime = dateValue(b);
        if (aTime === null) return bTime === null ? a.id.localeCompare(b.id) : 1;
        if (bTime === null) return -1;
        return aTime - bTime || a.id.localeCompare(b.id);
      });
    case 'highest':
      return sorted.sort((a, b) => b.score - a.score || newestFirst(a, b));
    case 'lowest':
      return sorted.sort((a, b) => a.score - b.score || newestFirst(a, b));
    case 'helpful':
      return sorted.sort((a, b) => b.thumbsUp - a.thumbsUp || newestFirst(a, b));
  }
}

export function filterReviews(
  reviews: Review[],
  bookmarks: ReadonlySet<string>,
  filters: ReviewFilterState,
  searchValue = filters.search,
  endsWithValue = filters.endsWith,
): Review[] {
  const queryTerms = normalizeSearch(searchValue).split(' ').filter(Boolean);
  const suffix = normalizeSuffix(endsWithValue);
  const endingActive = Boolean(suffix) || filters.endsWithMode !== 'text';
  const { fromTime, toTime } = resolveDateRange(filters);
  const hasDateFilter = fromTime !== null || toTime !== null;

  const result = reviews.filter((review) => {
    if (review.score < filters.minRating || review.score > filters.maxRating) return false;
    if (filters.language !== 'all' && review.language !== filters.language) return false;
    if (filters.version !== 'all' && review.version !== filters.version) return false;
    if (filters.developerReply === 'with' && !review.replyText) return false;
    if (filters.developerReply === 'without' && review.replyText) return false;
    if (filters.bookmarkedOnly && !bookmarks.has(review.id)) return false;

    if (hasDateFilter) {
      const time = dateValue(review);
      if (time === null) return false;
      if (fromTime !== null && time < fromTime) return false;
      if (toTime !== null && time > toTime) return false;
    }

    if (endingActive && !matchesEnding(review.text, filters.endsWithMode, suffix)) return false;

    if (queryTerms.length > 0) {
      const haystack = normalizeSearch(
        [
          review.title,
          review.text,
          review.userName,
          review.version,
          review.replyText,
          review.language,
          review.sentiment,
          String(review.score),
          `${review.score} star`,
        ]
          .filter(Boolean)
          .join(' '),
      );
      if (!queryTerms.every((term) => haystack.includes(term))) return false;
    }

    return true;
  });

  return sortReviews(result, filters.sortBy);
}

export function countActiveFilters(filters: ReviewFilterState): number {
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
}
