import { Download, MessageSquareText, Star, Tag, Users } from 'lucide-react';
import { AppHeaderCard } from './AppHeaderCard';
import { StatTile } from './StatTile';
import type { AppDetails } from '@/types/app';

export function OverviewCards({ app, reviewsCount }: { app: AppDetails; reviewsCount: number }) {
  return (
    <div className="flex flex-col gap-4">
      <AppHeaderCard app={app} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile icon={Tag} label="Current Version" value={app.version} delay={0.05} />
        <StatTile icon={Download} label="Installs" value={app.installs} delay={0.1} />
        <StatTile icon={Star} label="Average Rating" value={Number(app.score.toFixed(2))} delay={0.15} />
        <StatTile icon={Users} label="Total Ratings" value={app.ratings} delay={0.2} />
        <StatTile icon={MessageSquareText} label="Reviews Fetched" value={reviewsCount} delay={0.25} />
      </div>
    </div>
  );
}
