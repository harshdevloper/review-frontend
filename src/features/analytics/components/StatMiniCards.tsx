import { AlignLeft, ReplyAll } from 'lucide-react';
import { StatTile } from '@/features/dashboard/components/StatTile';

export function StatMiniCards({
  avgReviewLength,
  developerReplyPercentage,
}: {
  avgReviewLength: number;
  developerReplyPercentage: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatTile icon={AlignLeft} label="Avg. review length (words)" value={avgReviewLength} />
      <StatTile icon={ReplyAll} label="Developer reply rate" value={developerReplyPercentage} suffix="%" />
    </div>
  );
}
