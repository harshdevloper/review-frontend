import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function ChartCard({
  title,
  subtitle,
  delay = 0,
  className = '',
  children,
}: {
  title: string;
  subtitle?: string;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      className={`glass rounded-2xl p-5 sm:p-6 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
    </motion.div>
  );
}
