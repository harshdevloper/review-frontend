import { useCallback, useEffect, useState } from 'react';

function storageKey(packageName: string): string {
  return `playreview-ai:bookmarks:${packageName}`;
}

function readBookmarks(packageName: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey(packageName));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function useBookmarks(packageName: string) {
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => readBookmarks(packageName));

  useEffect(() => {
    setBookmarks(readBookmarks(packageName));
  }, [packageName]);

  const toggle = useCallback(
    (reviewId: string) => {
      setBookmarks((prev) => {
        const next = new Set(prev);
        if (next.has(reviewId)) next.delete(reviewId);
        else next.add(reviewId);
        localStorage.setItem(storageKey(packageName), JSON.stringify([...next]));
        return next;
      });
    },
    [packageName],
  );

  return { bookmarks, toggle };
}
