import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { CHART_INK, SINGLE_SERIES_BLUE } from '../chartTokens';
import { formatFullNumber } from '@/lib/format';
import type { VersionBreakdownPoint } from '@/types/review';

export function VersionBarChart({ data }: { data: VersionBreakdownPoint[] }) {
  return (
    <ChartCard title="Version-wise Reviews" subtitle="Which app versions reviewers mention most">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
          <XAxis
            dataKey="version"
            tick={{ fill: CHART_INK.secondary, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            angle={-35}
            textAnchor="end"
            height={56}
            interval={0}
          />
          <YAxis tick={{ fill: CHART_INK.secondary, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map((p) => ({ name: 'Reviews', value: p.value as number, color: SINGLE_SERIES_BLUE }))}
                label={label}
                valueFormatter={(v) => formatFullNumber(Number(v))}
              />
            )}
          />
          <Bar dataKey="count" fill={SINGLE_SERIES_BLUE} radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
