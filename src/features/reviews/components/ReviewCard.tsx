import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Bookmark, ChevronDown, Copy, CornerDownRight, Share2, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/layout/StarRating';
import { HighlightedText } from './HighlightedText';
import { formatDate, formatFullNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Review } from '@/types/review';

const TEXT_CLAMP_LENGTH = 260;

export function ReviewCard({
  review,
  query,
  isBookmarked,
  onToggleBookmark,
}: {
  review: Review;
  query: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > TEXT_CLAMP_LENGTH;
  const displayText = expanded || !isLong ? review.text : `${review.text.slice(0, TEXT_CLAMP_LENGTH)}…`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(review.text);
    toast.success('Review copied to clipboard');
  };

  const handleShare = async () => {
    const shareData = {
      title: `Review by ${review.userName}`,
      text: `"${review.text}" — ${review.userName} (${review.score}★)`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no-op
      }
    } else {
      await navigator.clipboard.writeText(shareData.text);
      toast.success('Review copied — sharing isn\'t supported on this browser');
    }
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="glass rounded-2xl p-5 transition-shadow hover:shadow-xl hover:shadow-blue-500/5"
    >
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={review.userImage} alt="" />
          <AvatarFallback>{review.userName.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-medium text-foreground">
              <HighlightedText text={review.userName} query={query} />
            </span>
            <StarRating score={review.score} size="xs" />
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span>{formatDate(review.date)}</span>
            {review.version ? (
              <>
                <span className="opacity-40">·</span>
                <span>v{review.version}</span>
              </>
            ) : null}
            <span className="opacity-40">·</span>
            <span>{review.language}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark review'}
            aria-pressed={isBookmarked}
          >
            <Bookmark className={cn('size-4', isBookmarked && 'fill-primary text-primary')} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleCopy} aria-label="Copy review text">
            <Copy className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleShare} aria-label="Share review">
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>

      {review.title ? <p className="mt-3 text-sm font-semibold text-foreground">{review.title}</p> : null}

      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        <HighlightedText text={displayText} query={query} />
      </p>

      {isLong ? (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
          <ChevronDown className={cn('size-3 transition-transform', expanded && 'rotate-180')} />
        </button>
      ) : null}

      {review.replyText ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 p-3">
          <CornerDownRight className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-primary">
              Developer response {review.replyDate ? `· ${formatDate(review.replyDate)}` : ''}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <HighlightedText text={review.replyText} query={query} />
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-3">
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <ThumbsUp className="size-3" />
          {formatFullNumber(review.thumbsUp)} helpful
        </Badge>
      </div>
    </motion.div>
  );
}
