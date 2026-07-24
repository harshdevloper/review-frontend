interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  payload?: Record<string, unknown>;
}

export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  labelFormatter?: (label: string | number | undefined) => string;
  valueFormatter?: (value: number | string | undefined, name?: string) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="glass-strong rounded-xl px-3.5 py-2.5 text-xs shadow-xl">
      {label !== undefined ? (
        <p className="mb-1.5 font-medium text-foreground">
          {labelFormatter ? labelFormatter(label) : String(label)}
        </p>
      ) : null}
      <div className="flex flex-col gap-1">
        {payload.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ml-auto font-semibold text-foreground">
              {valueFormatter ? valueFormatter(item.value, item.name) : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
