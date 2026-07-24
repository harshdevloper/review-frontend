import { ChartCard } from './ChartCard';
import { SINGLE_SERIES_BLUE } from '../chartTokens';
import { formatFullNumber } from '@/lib/format';
import type { HeatmapPoint } from '@/types/review';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOUR_TICKS = [0, 6, 12, 18, 23];

export function ReviewHeatmap({ data }: { data: HeatmapPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const grid = new Map<string, number>();
  for (const point of data) grid.set(`${point.day}-${point.hour}`, point.count);

  return (
    <ChartCard title="Review Frequency" subtitle="When reviewers post, by day and hour (UTC)" className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-[3px]">
          <div />
          {Array.from({ length: 24 }).map((_, hour) => (
            <div key={hour} className="text-center text-[10px] text-muted-foreground">
              {HOUR_TICKS.includes(hour) ? hour : ''}
            </div>
          ))}

          {DAY_LABELS.map((label, day) => (
            <div key={label} className="contents">
              <div className="flex items-center text-[11px] text-muted-foreground">{label}</div>
              {Array.from({ length: 24 }).map((_, hour) => {
                const count = grid.get(`${day}-${hour}`) ?? 0;
                const intensity = count === 0 ? 0.05 : 0.15 + (count / max) * 0.85;
                return (
                  <div key={hour} className="group relative">
                    <div
                      tabIndex={0}
                      className="aspect-square w-full rounded-[3px] outline-none transition-transform focus-visible:scale-125 focus-visible:ring-2 focus-visible:ring-primary group-hover:scale-125"
                      style={{ backgroundColor: SINGLE_SERIES_BLUE, opacity: intensity }}
                    />
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover px-2 py-1 text-[11px] text-popover-foreground opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                      {label} {hour}:00 · {formatFullNumber(count)} reviews
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-[3px]">
            {[0.15, 0.35, 0.55, 0.75, 1].map((op) => (
              <div key={op} className="size-3 rounded-[3px]" style={{ backgroundColor: SINGLE_SERIES_BLUE, opacity: op }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </ChartCard>
  );
}
