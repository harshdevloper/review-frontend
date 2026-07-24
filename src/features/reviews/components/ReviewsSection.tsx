import { FilterToolbar } from './FilterToolbar';
import { ReviewList } from './ReviewList';
import { ExportMenu } from '@/features/export/components/ExportMenu';
import { useBookmarks } from '../hooks/useBookmarks';
import { useReviewFilters } from '../hooks/useReviewFilters';
import type { AppDetails } from '@/types/app';
import type { Review } from '@/types/review';

export function ReviewsSection({ app, reviews }: { app: AppDetails; reviews: Review[] }) {
  const { bookmarks, toggle } = useBookmarks(app.packageName);
  const { filters, setFilters, filtered, languages, versions, activeFilterCount, resetFilters, searchQuery } =
    useReviewFilters(reviews, bookmarks);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Reviews <span className="ml-1 text-foreground">{reviews.length.toLocaleString()}</span>
        </h2>
        <ExportMenu app={app} reviews={filtered} filteredCount={filtered.length} />
      </div>

      <FilterToolbar
        filters={filters}
        setFilters={setFilters}
        languages={languages}
        versions={versions}
        activeFilterCount={activeFilterCount}
        resetFilters={resetFilters}
        resultCount={filtered.length}
      />

      <ReviewList reviews={filtered} query={searchQuery} bookmarks={bookmarks} onToggleBookmark={toggle} />
    </section>
  );
}
