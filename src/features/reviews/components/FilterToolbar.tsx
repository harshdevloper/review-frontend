import { Bookmark, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { DateMode, EndsWithMode, ReviewFilterState, SortOption } from '../hooks/useReviewFilters';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest', label: 'Highest rating' },
  { value: 'lowest', label: 'Lowest rating' },
  { value: 'helpful', label: 'Most helpful' },
];

const DATE_MODES: { value: DateMode; label: string }[] = [
  { value: 'single', label: 'Single day' },
  { value: 'range', label: 'Range' },
];

const QUICK_EMOJI = ['🔥', '❤️', '😍', '👍', '👎', '😡', '😭', '🙏', '💯', '⭐'];

const ENDS_WITH_MODES: { value: EndsWithMode; label: string }[] = [
  { value: 'text', label: 'Exact' },
  { value: 'emoji', label: 'Any emoji' },
  { value: 'number', label: 'Any number' },
  { value: 'symbol', label: 'Any symbol' },
  { value: 'letter', label: 'Any letter' },
];

export function FilterToolbar({
  filters,
  setFilters,
  languages,
  versions,
  activeFilterCount,
  resetFilters,
  resultCount,
}: {
  filters: ReviewFilterState;
  setFilters: (updater: (prev: ReviewFilterState) => ReviewFilterState) => void;
  languages: string[];
  versions: string[];
  activeFilterCount: number;
  resetFilters: () => void;
  resultCount: number;
}) {
  return (
    <div className="glass-strong sticky top-[4.5rem] z-30 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          placeholder="Search reviews, usernames, versions, or replies..."
          className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        <span className="shrink-0 text-xs text-muted-foreground">{resultCount.toLocaleString()} results</span>
      </div>

      <div className="flex items-center gap-2">
        <Select value={filters.sortBy} onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value as SortOption }))}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={filters.bookmarkedOnly ? 'default' : 'outline'}
          size="icon"
          aria-pressed={filters.bookmarkedOnly}
          aria-label="Show bookmarked reviews only"
          onClick={() => setFilters((prev) => ({ ...prev, bookmarkedOnly: !prev.bookmarkedOnly }))}
        >
          <Bookmark className={cn('size-4', filters.bookmarkedOnly && 'fill-current')} />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative gap-1.5">
              <SlidersHorizontal className="size-4" />
              Filters
              {activeFilterCount > 0 ? (
                <Badge className="ml-0.5 h-4.5 min-w-4.5 px-1">{activeFilterCount}</Badge>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 rounded-2xl p-4">
            <div className="flex flex-col gap-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Rating range</Label>
                  <span className="text-xs font-medium text-foreground">
                    {filters.minRating}★ – {filters.maxRating}★
                  </span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[filters.minRating, filters.maxRating]}
                  onValueChange={([min, max]) => setFilters((prev) => ({ ...prev, minRating: min, maxRating: max }))}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <div className="flex items-center gap-0.5 rounded-lg bg-white/5 p-0.5">
                    {DATE_MODES.map((mode) => (
                      <button
                        key={mode.value}
                        type="button"
                        aria-pressed={filters.dateMode === mode.value}
                        onClick={() => setFilters((prev) => ({ ...prev, dateMode: mode.value }))}
                        className={cn(
                          'rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
                          filters.dateMode === mode.value
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filters.dateMode === 'single' ? (
                  <Input
                    type="date"
                    aria-label="Show reviews posted on this day"
                    value={filters.dateFrom ?? ''}
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value || null }))}
                    className="h-9"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="mb-1.5 block text-xs text-muted-foreground">From</Label>
                      <Input
                        type="date"
                        value={filters.dateFrom ?? ''}
                        onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value || null }))}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-xs text-muted-foreground">To</Label>
                      <Input
                        type="date"
                        value={filters.dateTo ?? ''}
                        onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value || null }))}
                        className="h-9"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Ends with</Label>
                  {filters.endsWith || filters.endsWithMode !== 'text' ? (
                    <button
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, endsWith: '', endsWithMode: 'text' }))}
                      className="text-[11px] font-medium text-primary hover:underline"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>

                <div className="mb-2 flex flex-wrap gap-1">
                  {ENDS_WITH_MODES.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      aria-pressed={filters.endsWithMode === mode.value}
                      onClick={() => setFilters((prev) => ({ ...prev, endsWithMode: mode.value }))}
                      className={cn(
                        'rounded-lg px-2 py-1 text-[11px] font-medium transition-colors',
                        filters.endsWithMode === mode.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/5 text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                <Input
                  value={filters.endsWith}
                  onChange={(e) => setFilters((prev) => ({ ...prev, endsWith: e.target.value }))}
                  placeholder={
                    filters.endsWithMode === 'text'
                      ? 'Any ending — 🔥, $500, !!!, "ever", 5'
                      : 'Narrow further (optional)'
                  }
                  className="h-9"
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {QUICK_EMOJI.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      aria-label={`Reviews ending with ${emoji}`}
                      aria-pressed={filters.endsWith === emoji}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, endsWith: prev.endsWith === emoji ? '' : emoji }))
                      }
                      className={cn(
                        'rounded-lg border px-1.5 py-1 text-sm leading-none transition-colors',
                        filters.endsWith === emoji
                          ? 'border-primary bg-primary/15'
                          : 'border-transparent bg-white/5 hover:bg-white/10',
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">Language</Label>
                <Select value={filters.language} onValueChange={(value) => setFilters((prev) => ({ ...prev, language: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">Version</Label>
                <Select value={filters.version} onValueChange={(value) => setFilters((prev) => ({ ...prev, version: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All versions</SelectItem>
                    {versions.map((version) => (
                      <SelectItem key={version} value={version}>
                        {version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">Developer replies</Label>
                <Select
                  value={filters.developerReply}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, developerReply: value as ReviewFilterState['developerReply'] }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="with">With reply</SelectItem>
                    <SelectItem value="without">Without reply</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5 self-start">
                <RotateCcw className="size-3.5" />
                Reset filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
