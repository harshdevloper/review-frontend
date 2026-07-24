import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { CHART_INK, SINGLE_SERIES_BLUE } from '../chartTokens';
import { formatFullNumber } from '@/lib/format';
import type { TimelinePoint } from '@/types/review';

export function TimelineChart({ data }: { data: TimelinePoint[] }) {
  return (
    <ChartCard title="Reviews Timeline" subtitle="Review volume by month">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="timelineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SINGLE_SERIES_BLUE} stopOpacity={0.35} />
              <stop offset="100%" stopColor={SINGLE_SERIES_BLUE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
          <XAxis
            dataKey="month"
            tick={{ fill: CHART_INK.secondary, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis tick={{ fill: CHART_INK.secondary, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map((p) => ({ name: 'Reviews', value: p.value as number, color: SINGLE_SERIES_BLUE }))}
                label={label}
                valueFormatter={(v) => formatFullNumber(Number(v))}
              />
            )}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={SINGLE_SERIES_BLUE}
            strokeWidth={2}
            fill="url(#timelineFill)"
            activeDot={{ r: 4, strokeWidth: 2, stroke: '#0F172A' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
