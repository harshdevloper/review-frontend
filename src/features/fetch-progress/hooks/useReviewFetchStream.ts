import { useCallback, useEffect, useRef, useState } from 'react';
import { streamReviews, getCachedReviews, type FetchStageEvent, type FetchErrorEvent } from '@/api/reviews.api';
import { queryClient, reviewsQueryKey } from '@/lib/queryClient';
import type { AppDetails } from '@/types/app';
import type { Analytics, Review, ReviewFetchResult } from '@/types/review';

export type FetchStatus = 'idle' | 'streaming' | 'complete' | 'error';

interface UseReviewFetchStreamOptions {
  onComplete?: (result: ReviewFetchResult) => void;
}

export interface PartialResult {
  app: AppDetails;
  reviews: Review[];
  analytics: Analytics | null;
  reviewCollection?: ReviewFetchResult['reviewCollection'];
}

// Reviews arrive far faster than anyone can read them, so state is committed on a timer instead of
// per chunk — otherwise a 18k-review fetch would trigger a re-render of the whole list ~40 times.
const COMMIT_INTERVAL_MS = 800;

export function useReviewFetchStream(options: UseReviewFetchStreamOptions = {}) {
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [stage, setStage] = useState<FetchStageEvent | null>(null);
  const [error, setError] = useState<FetchErrorEvent | null>(null);
  const [partial, setPartial] = useState<PartialResult | null>(null);

  const stopRef = useRef<(() => void) | null>(null);
  const appRef = useRef<AppDetails | null>(null);
  const reviewsRef = useRef<Review[]>([]);
  const analyticsRef = useRef<Analytics | null>(null);
  const commitTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onCompleteRef = useRef(options.onComplete);
  useEffect(() => {
    onCompleteRef.current = options.onComplete;
  }, [options.onComplete]);

  const commit = useCallback(() => {
    if (!appRef.current) return;
    setPartial({ app: appRef.current, reviews: reviewsRef.current.slice(), analytics: analyticsRef.current });
  }, []);

  const stopCommitTimer = useCallback(() => {
    if (commitTimerRef.current === null) return;
    clearInterval(commitTimerRef.current);
    commitTimerRef.current = null;
  }, []);

  const start = useCallback(
    (url: string) => {
      stopRef.current?.();
      stopCommitTimer();
      setStatus('streaming');
      setError(null);
      setStage(null);
      setPartial(null);
      appRef.current = null;
      reviewsRef.current = [];
      analyticsRef.current = null;

      commitTimerRef.current = setInterval(commit, COMMIT_INTERVAL_MS);

      stopRef.current = streamReviews(url, {
        onStage: (event) => setStage(event),
        onApp: (app) => {
          appRef.current = app;
          commit();
        },
        onReviews: (batch) => {
          // Chunks are already detached arrays; append in place so replaying a 100k-review cache
          // does not repeatedly copy the entire accumulated list (quadratic work).
          reviewsRef.current.push(...batch);
        },
        onAnalytics: (analytics) => {
          analyticsRef.current = analytics;
        },
        onComplete: async (event) => {
          stopCommitTimer();
          try {
            const result = await getCachedReviews(event.packageName);
            queryClient.setQueryData(reviewsQueryKey(event.packageName), result);
            setStatus('complete');
            onCompleteRef.current?.(result);
          } catch {
            // the cache read is only a convenience — everything needed was already streamed
            if (appRef.current && analyticsRef.current) {
              const result: ReviewFetchResult = {
                packageName: event.packageName,
                app: appRef.current,
                reviews: reviewsRef.current,
                analytics: analyticsRef.current,
                fetchedAt: new Date().toISOString(),
              };
              queryClient.setQueryData(reviewsQueryKey(event.packageName), result);
              setStatus('complete');
              onCompleteRef.current?.(result);
              return;
            }
            setStatus('error');
            setError({
              code: 'FETCH_RESULT_FAILED',
              message: 'Reviews were fetched but could not be loaded into the dashboard.',
              suggestion: 'Try fetching this app again.',
            });
          }
        },
        onError: (event) => {
          stopCommitTimer();
          setStatus('error');
          setError(event);
        },
      });
    },
    [commit, stopCommitTimer],
  );

  const reset = useCallback(() => {
    stopRef.current?.();
    stopCommitTimer();
    setStatus('idle');
    setStage(null);
    setError(null);
    setPartial(null);
  }, [stopCommitTimer]);

  // closes the connection without touching state — safe to call from an
  // unmount cleanup, where updating state would be a no-op at best
  const stop = useCallback(() => {
    stopRef.current?.();
    stopCommitTimer();
  }, [stopCommitTimer]);

  useEffect(() => stop, [stop]);

  return { status, stage, error, partial, start, reset, stop };
}
