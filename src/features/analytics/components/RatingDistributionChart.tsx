import { Bar, BarChart, Cell, LabelList, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { CHART_INK, RATING_ORDINAL_RAMP } from '../chartTokens';
import { formatFullNumber } from '@/lib/format';
import type { RatingDistribution } from '@/types/review';

export function RatingDistributionChart({ data }: { data: RatingDistribution }) {
  const rows = ([5, 4, 3, 2, 1] as const).map((star) => ({
    star: `${star} star${star === 1 ? '' : 's'}`,
    starNum: star,
    count: data[star],
  }));

  return (
    <ChartCard title="Rating Distribution" subtitle="Number of reviews per star rating">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 28, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke={CHART_INK.grid} />
          <XAxis type="number" tick={{ fill: CHART_INK.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="star"
            width={64}
            tick={{ fill: CHART_INK.secondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map((p) => ({ name: 'Reviews', value: p.value as number, color: p.payload.fill }))}
                label={payload?.[0]?.payload?.star}
                valueFormatter={(v) => formatFullNumber(Number(v))}
              />
            )}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {rows.map((row) => (
              <Cell key={row.starNum} fill={RATING_ORDINAL_RAMP[row.starNum]} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              formatter={(value) => formatFullNumber(Number(value ?? 0))}
              style={{ fill: CHART_INK.secondary, fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
