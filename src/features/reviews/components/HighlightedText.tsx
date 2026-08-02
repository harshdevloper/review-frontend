import { memo, useMemo } from 'react';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Rendered two or three times per review card, which makes it one of the hottest paths while
 * results stream in. Memoised on (text, query), and the regex split only runs when there is a
 * query at all — the common case is no search term, which now costs nothing but returning the
 * string.
 */
export const HighlightedText = memo(function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = useMemo(() => {
    const term = query.trim();
    if (!term) return null;
    return text.split(new RegExp(`(${escapeRegExp(term)})`, 'ig'));
  }, [text, query]);

  if (!parts) return <>{text}</>;

  const lowered = query.trim().toLowerCase();
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === lowered ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </>
  );
});
