import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { CHART_INK, SINGLE_SERIES_BLUE } from '../chartTokens';
import type { TimelinePoint } from '@/types/review';

export function AvgRatingTrendChart({ data }: { data: TimelinePoint[] }) {
  return (
    <ChartCard title="Average Rating Trend" subtitle="Mean star rating by month">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
          <XAxis
            dataKey="month"
            tick={{ fill: CHART_INK.secondary, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fill: CHART_INK.secondary, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map((p) => ({ name: 'Avg rating', value: p.value as number, color: SINGLE_SERIES_BLUE }))}
                label={label}
                valueFormatter={(v) => Number(v).toFixed(2)}
              />
            )}
          />
          <Line
            type="monotone"
            dataKey="avgRating"
            stroke={SINGLE_SERIES_BLUE}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: '#0F172A' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
