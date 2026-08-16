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
    const terms = [...new Set(query.trim().split(/\s+/).filter(Boolean))].sort((a, b) => b.length - a.length);
    if (terms.length === 0) return null;
    return text.split(new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'igu'));
  }, [text, query]);

  if (!parts) return <>{text}</>;

  const terms = new Set(query.trim().split(/\s+/).filter(Boolean).map((term) => term.toLocaleLowerCase()));
  return (
    <>
      {parts.map((part, i) =>
        terms.has(part.toLocaleLowerCase()) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </>
  );
});
