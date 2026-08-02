import { useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { OverviewCards } from '@/features/dashboard/components/OverviewCards';
import { AnalyticsSection } from '@/features/analytics/components/AnalyticsSection';
import { ReviewsSection } from '@/features/reviews/components/ReviewsSection';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { ProgressOverlay } from '@/features/fetch-progress/components/ProgressOverlay';
import { LiveFetchBanner, AnalyticsPending } from '@/features/fetch-progress/components/LiveFetchBanner';
import { ErrorState } from '@/features/states/components/ErrorState';
import { EmptyState } from '@/features/states/components/EmptyState';
import { useReviewFetchStream } from '@/features/fetch-progress/hooks/useReviewFetchStream';
import { getCachedReviews } from '@/api/reviews.api';
import { reviewsQueryKey } from '@/lib/queryClient';
import { ApiError } from '@/api/client';

function playStoreUrlFor(packageName: string): string {
  return `https://play.google.com/store/apps/details?id=${packageName}`;
}

export default function DashboardPage() {
  const { packageName = '' } = useParams();
  const navigate = useNavigate();
  const refetchStartedFor = useRef<string | null>(null);

  const { status, stage, error, partial, start, reset } = useReviewFetchStream();

  const query = useQuery({
    queryKey: reviewsQueryKey(packageName),
    queryFn: () => getCachedReviews(packageName),
    enabled: Boolean(packageName),
    retry: false,
  });

  // Deep-link / refresh path: if the cache endpoint 404s (NOT_CACHED), re-run the
  // live SSE fetch once for this package so the dashboard self-heals.
  const notCached = query.isError && query.error instanceof ApiError && query.error.code === 'NOT_CACHED';

  useEffect(() => {
    if (notCached && packageName && refetchStartedFor.current !== packageName) {
      refetchStartedFor.current = packageName;
      start(playStoreUrlFor(packageName));
    }
  }, [notCached, packageName, start]);

  // When the stream completes it seeds the query cache; re-read it here.
  useEffect(() => {
    if (status === 'complete') {
      void query.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleRetry = useCallback(() => {
    refetchStartedFor.current = packageName;
    reset();
    start(playStoreUrlFor(packageName));
  }, [packageName, reset, start]);

  if (!packageName) {
    return (
      <>
        <Navbar />
        <EmptyState />
      </>
    );
  }

  // Actively fetching. The overlay only holds the screen until the first reviews arrive — after
  // that the dashboard renders live off the partial stream and fills in as more land.
  const isFetching = status === 'streaming' || (notCached && status !== 'error');
  if (isFetching && !partial?.reviews.length) {
    return (
      <>
        <Navbar />
        <ProgressOverlay stage={stage} />
      </>
    );
  }

  if (status === 'error' && error) {
    return (
      <>
        <Navbar />
        <ErrorState error={error} onRetry={handleRetry} />
      </>
    );
  }

  if (query.isLoading) {
    return (
      <>
        <Navbar />
        <DashboardSkeleton />
      </>
    );
  }

  if (query.isError && !notCached) {
    const apiError = query.error instanceof ApiError ? query.error : null;
    return (
      <>
        <Navbar />
        <ErrorState
          error={{
            code: apiError?.code ?? 'UNKNOWN',
            message: apiError?.message ?? 'Failed to load this dashboard.',
            suggestion: apiError?.suggestion,
          }}
          onRetry={handleRetry}
        />
      </>
    );
  }

  // while streaming, the partial result is ahead of anything the cache endpoint can return
  const data = (isFetching && partial ? partial : query.data) ?? partial;
  if (!data) {
    return (
      <>
        <Navbar />
        <DashboardSkeleton />
      </>
    );
  }

  return (
    <>
      <Navbar>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1.5">
          <ArrowLeft className="size-4" />
          New search
        </Button>
      </Navbar>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8"
      >
        {isFetching ? <LiveFetchBanner reviewCount={data.reviews.length} stage={stage} /> : null}
        <OverviewCards app={data.app} reviewsCount={data.reviews.length} />
        {data.analytics ? <AnalyticsSection analytics={data.analytics} /> : <AnalyticsPending />}
        <ReviewsSection app={data.app} reviews={data.reviews} />
      </motion.main>
    </>
  );
}
