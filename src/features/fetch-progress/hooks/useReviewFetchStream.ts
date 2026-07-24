import { useCallback, useEffect, useRef, useState } from 'react';
import { streamReviews, getCachedReviews, type FetchStageEvent, type FetchErrorEvent } from '@/api/reviews.api';
import { queryClient, reviewsQueryKey } from '@/lib/queryClient';
import type { ReviewFetchResult } from '@/types/review';

export type FetchStatus = 'idle' | 'streaming' | 'complete' | 'error';

interface UseReviewFetchStreamOptions {
  onComplete?: (result: ReviewFetchResult) => void;
}

export function useReviewFetchStream(options: UseReviewFetchStreamOptions = {}) {
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [stage, setStage] = useState<FetchStageEvent | null>(null);
  const [error, setError] = useState<FetchErrorEvent | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const onCompleteRef = useRef(options.onComplete);
  useEffect(() => {
    onCompleteRef.current = options.onComplete;
  }, [options.onComplete]);

  const start = useCallback(
    (url: string) => {
      stopRef.current?.();
      setStatus('streaming');
      setError(null);
      setStage(null);

      stopRef.current = streamReviews(url, {
        onStage: (event) => setStage(event),
        onComplete: async (event) => {
          try {
            const result = await getCachedReviews(event.packageName);
            queryClient.setQueryData(reviewsQueryKey(event.packageName), result);
            setStatus('complete');
            onCompleteRef.current?.(result);
          } catch {
            setStatus('error');
            setError({
              code: 'FETCH_RESULT_FAILED',
              message: 'Reviews were fetched but could not be loaded into the dashboard.',
              suggestion: 'Try fetching this app again.',
            });
          }
        },
        onError: (event) => {
          setStatus('error');
          setError(event);
        },
      });
    },
    [],
  );

  const reset = useCallback(() => {
    stopRef.current?.();
    setStatus('idle');
    setStage(null);
    setError(null);
  }, []);

  // closes the connection without touching state — safe to call from an
  // unmount cleanup, where updating state would be a no-op at best
  const stop = useCallback(() => {
    stopRef.current?.();
  }, []);

  useEffect(() => stop, [stop]);

  return { status, stage, error, start, reset, stop };
}
