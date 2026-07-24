import { apiGet } from './client';
import type { ReviewFetchResult } from '@/types/review';

export function getCachedReviews(packageName: string): Promise<ReviewFetchResult> {
  return apiGet<ReviewFetchResult>(`/reviews/${encodeURIComponent(packageName)}`);
}

export type FetchStageName =
  | 'connecting'
  | 'app-details'
  | 'downloading-reviews'
  | 'analytics'
  | 'preparing';

export interface FetchStageEvent {
  stage: FetchStageName;
  message: string;
  progress: number;
  reviewCount?: number;
}

export interface FetchCompleteEvent {
  packageName: string;
  reviewCount: number;
  progress: number;
}

export interface FetchErrorEvent {
  code: string;
  message: string;
  suggestion?: string;
}

export function streamReviews(
  url: string,
  handlers: {
    onStage: (event: FetchStageEvent) => void;
    onComplete: (event: FetchCompleteEvent) => void;
    onError: (event: FetchErrorEvent) => void;
  },
): () => void {
  const source = new EventSource(`/api/reviews/stream?url=${encodeURIComponent(url)}`);

  source.addEventListener('stage', (evt) => {
    handlers.onStage(JSON.parse((evt as MessageEvent).data) as FetchStageEvent);
  });

  source.addEventListener('complete', (evt) => {
    handlers.onComplete(JSON.parse((evt as MessageEvent).data) as FetchCompleteEvent);
    source.close();
  });

  // server-reported failure (invalid URL, app not found, scrape error, etc.)
  source.addEventListener('fetch-error', (evt) => {
    handlers.onError(JSON.parse((evt as MessageEvent).data) as FetchErrorEvent);
    source.close();
  });

  // EventSource's native connection-level error (network drop, server unreachable)
  source.addEventListener('error', () => {
    if (source.readyState === EventSource.CLOSED) return;
    handlers.onError({
      code: 'CONNECTION_ERROR',
      message: 'Lost connection to the server while fetching reviews.',
      suggestion: 'Check that the backend is running and try again.',
    });
    source.close();
  });

  return () => source.close();
}
