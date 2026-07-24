import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from './ChartCard';
import { ChartTooltip } from './ChartTooltip';
import { STATUS } from '../chartTokens';
import { formatFullNumber } from '@/lib/format';
import type { Sentiment } from '@/types/review';

const SENTIMENT_META: Record<Sentiment, { label: string; color: string }> = {
  positive: { label: 'Positive', color: STATUS.good },
  neutral: { label: 'Neutral', color: STATUS.warning },
  negative: { label: 'Negative', color: STATUS.critical },
};

export function SentimentPieChart({ data }: { data: Record<Sentiment, number> }) {
  const total = data.positive + data.neutral + data.negative || 1;
  const rows = (['positive', 'neutral', 'negative'] as const).map((key) => ({
    key,
    name: SENTIMENT_META[key].label,
    value: data[key],
    color: SENTIMENT_META[key].color,
    percent: Math.round((data[key] / total) * 100),
  }));

  return (
    <ChartCard title="Sentiment Breakdown" subtitle="Positive, neutral, and negative reviews">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={90}
            paddingAngle={2}
            cornerRadius={4}
            strokeWidth={2}
            stroke="#0F172A"
          >
            {rows.map((row) => (
              <Cell key={row.key} fill={row.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map((p) => ({
                  name: p.name as string,
                  value: p.value as number,
                  color: (p.payload as { color: string }).color,
                }))}
                valueFormatter={(v) => formatFullNumber(Number(v))}
              />
            )}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value) => {
              const row = rows.find((r) => r.name === value);
              return (
                <span className="text-xs text-muted-foreground">
                  {value} <span className="text-foreground">{row?.percent}%</span>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
