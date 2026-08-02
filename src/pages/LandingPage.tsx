import { useCallback, useEffect, useRef, useState } from 'react';
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
  const handedOff = useRef(false);
  const { status, stage, error, partial, start, reset } = useReviewFetchStream({
    onComplete: (result) => {
      if (handedOff.current) return;
      handedOff.current = true;
      navigate(`/app/${result.packageName}`);
    },
  });

  // Hand over to the dashboard the moment there is something worth showing, rather than sitting on
  // the overlay for the whole fetch. The scrape keeps running server-side after this unmounts, and
  // the dashboard re-attaches to that same job and replays what it has already collected.
  useEffect(() => {
    if (handedOff.current || status !== 'streaming') return;
    if (!partial?.app || partial.reviews.length === 0) return;
    handedOff.current = true;
    navigate(`/app/${partial.app.packageName}`);
  }, [status, partial, navigate]);

  const handleSubmit = useCallback(
    (url: string) => {
      handedOff.current = false;
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
