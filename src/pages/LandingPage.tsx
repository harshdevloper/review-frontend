import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/features/landing/components/Hero';
import { FeatureHighlights } from '@/features/landing/components/FeatureHighlights';
import { Footer } from '@/features/landing/components/Footer';
import { ProgressOverlay } from '@/features/fetch-progress/components/ProgressOverlay';
import { ErrorState } from '@/features/states/components/ErrorState';
import { useReviewFetchStream } from '@/features/fetch-progress/hooks/useReviewFetchStream';

export default function LandingPage() {
  const navigate = useNavigate();
  const [lastUrl, setLastUrl] = useState('');
  const { status, stage, error, start, reset } = useReviewFetchStream({
    onComplete: (result) => navigate(`/app/${result.packageName}`),
  });

  const handleSubmit = useCallback(
    (url: string) => {
      setLastUrl(url);
      start(url);
    },
    [start],
  );

  const handleRetry = useCallback(() => {
    if (lastUrl) start(lastUrl);
    else reset();
  }, [lastUrl, start, reset]);

  if (status === 'streaming' || status === 'complete') {
    return (
      <>
        <Navbar />
        <AnimatePresence mode="wait">
          <ProgressOverlay key="progress" stage={stage} />
        </AnimatePresence>
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

  return (
    <>
      <Navbar />
      <Hero onSubmit={handleSubmit} isSubmitting={false} />
      <FeatureHighlights />
      <Footer />
    </>
  );
}
