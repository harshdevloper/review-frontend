import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { formatCompactNumber } from '@/lib/format';

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  delay?: number;
  suffix?: string;
}

export function StatTile({ icon: Icon, label, value, delay = 0, suffix }: StatTileProps) {
  const isNumeric = typeof value === 'number';
  const animated = useCountUp(isNumeric ? value : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className="glass group relative overflow-hidden rounded-2xl p-5 transition-shadow hover:shadow-xl hover:shadow-blue-500/5"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
          <Icon className="size-4.5" />
        </span>
      </div>
      <p
        className={`mt-4 truncate font-semibold tracking-tight text-foreground ${isNumeric ? 'text-2xl' : 'text-xl'}`}
        title={isNumeric ? undefined : String(value)}
      >
        {isNumeric ? formatCompactNumber(animated) : value}
        {suffix ? <span className="text-base font-normal text-muted-foreground">{suffix}</span> : null}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </motion.div>
  );
}
