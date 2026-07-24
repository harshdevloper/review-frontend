import { RatingDistributionChart } from './RatingDistributionChart';
import { SentimentPieChart } from './SentimentPieChart';
import { TimelineChart } from './TimelineChart';
import { AvgRatingTrendChart } from './AvgRatingTrendChart';
import { VersionBarChart } from './VersionBarChart';
import { ReviewHeatmap } from './ReviewHeatmap';
import { KeywordCloud } from './KeywordCloud';
import { StatMiniCards } from './StatMiniCards';
import type { Analytics } from '@/types/review';

export function AnalyticsSection({ analytics }: { analytics: Analytics }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Analytics</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RatingDistributionChart data={analytics.ratingDistribution} />
        <SentimentPieChart data={analytics.sentiment} />
        <TimelineChart data={analytics.timeline} />
        <AvgRatingTrendChart data={analytics.timeline} />
        <VersionBarChart data={analytics.versionBreakdown} />
        <StatMiniCards
          avgReviewLength={analytics.avgReviewLength}
          developerReplyPercentage={analytics.developerReplyPercentage}
        />
      </div>
      <ReviewHeatmap data={analytics.heatmap} />
      <KeywordCloud data={analytics.topKeywords} />
    </section>
  );
}
