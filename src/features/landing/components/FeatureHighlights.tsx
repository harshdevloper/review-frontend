import { motion } from 'framer-motion';
import { BarChart3, Download, Filter, Globe2, MessagesSquare, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-time fetch progress',
    description: 'Watch reviews stream in live, from connection to a ready-to-explore dashboard in seconds.',
  },
  {
    icon: BarChart3,
    title: 'Deep analytics',
    description: 'Rating distribution, sentiment, timelines, version breakdowns, keyword clouds, and more.',
  },
  {
    icon: Filter,
    title: 'Instant filters & search',
    description: 'Slice thousands of reviews by rating, date, version, language, or developer replies — no reload.',
  },
  {
    icon: MessagesSquare,
    title: 'Rich review cards',
    description: 'Expandable cards with developer replies, helpful counts, bookmarks, and one-click sharing.',
  },
  {
    icon: Globe2,
    title: 'Multi-language aware',
    description: 'Automatic language detection surfaces the true spread of your global audience.',
  },
  {
    icon: Download,
    title: 'Export anywhere',
    description: 'Send your filtered dataset to Excel, CSV, JSON, or a polished PDF report in one click.',
  },
];

export function FeatureHighlights() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-14 max-w-xl text-center"
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Everything you need to understand your reviews
        </h2>
        <p className="mt-3 text-muted-foreground">
          One paste. A complete picture of how people feel about your app.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-6 transition-shadow hover:shadow-xl hover:shadow-blue-500/5"
          >
            <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <feature.icon className="size-5" />
            </span>
            <h3 className="text-[15px] font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
