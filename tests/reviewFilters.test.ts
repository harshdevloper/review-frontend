import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_FILTERS, countActiveFilters, filterReviews } from '../src/features/reviews/lib/reviewFilters.ts';
import type { Review } from '../src/types/review.ts';

function review(id: string, text: string, date: string, score: number, extra: Partial<Review> = {}): Review {
  return {
    id,
    userName: `User ${id}`,
    userImage: '',
    score,
    title: null,
    text,
    date,
    replyDate: null,
    replyText: null,
    version: '1.0',
    thumbsUp: 0,
    language: 'English',
    sentiment: score >= 4 ? 'positive' : score === 3 ? 'neutral' : 'negative',
    ...extra,
  };
}

const rows = [
  review('new', 'Fast loan approved 🔥', new Date(2026, 7, 15, 12).toISOString(), 5, { thumbsUp: 2 }),
  review('old', 'Slow support 500', new Date(2026, 6, 1, 12).toISOString(), 1, {
    replyText: 'Please contact us',
    thumbsUp: 10,
  }),
  review('invalid', 'No date', 'invalid', 3),
];

test('sorts newest first and leaves invalid dates last', () => {
  assert.deepEqual(filterReviews(rows, new Set(), DEFAULT_FILTERS).map(({ id }) => id), ['new', 'old', 'invalid']);
});

test('search matches normalized terms across text and rating metadata', () => {
  const filters = { ...DEFAULT_FILTERS, search: 'LOAN   5 star' };
  assert.deepEqual(filterReviews(rows, new Set(), filters).map(({ id }) => id), ['new']);
});

test('applies rating, reply, bookmark, ending, and date filters', () => {
  assert.deepEqual(
    filterReviews(rows, new Set(), { ...DEFAULT_FILTERS, minRating: 1, maxRating: 1 }).map(({ id }) => id),
    ['old'],
  );
  assert.deepEqual(
    filterReviews(rows, new Set(), { ...DEFAULT_FILTERS, developerReply: 'with' }).map(({ id }) => id),
    ['old'],
  );
  assert.deepEqual(
    filterReviews(rows, new Set(['new']), { ...DEFAULT_FILTERS, bookmarkedOnly: true }).map(({ id }) => id),
    ['new'],
  );
  assert.deepEqual(
    filterReviews(rows, new Set(), { ...DEFAULT_FILTERS, endsWith: '🔥' }).map(({ id }) => id),
    ['new'],
  );
  assert.deepEqual(
    filterReviews(rows, new Set(), { ...DEFAULT_FILTERS, endsWithMode: 'number' }).map(({ id }) => id),
    ['old'],
  );

  const selectedDay = `${new Date(2026, 7, 15).getFullYear()}-08-15`;
  assert.deepEqual(
    filterReviews(rows, new Set(), { ...DEFAULT_FILTERS, dateMode: 'single', dateFrom: selectedDay }).map(({ id }) => id),
    ['new'],
  );
});

test('counts active filters consistently', () => {
  assert.equal(countActiveFilters(DEFAULT_FILTERS), 0);
  assert.equal(countActiveFilters({ ...DEFAULT_FILTERS, minRating: 5, developerReply: 'without' }), 2);
});
