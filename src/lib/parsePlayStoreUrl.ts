const PACKAGE_NAME_RE = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;

export function extractPackageName(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const isPlayStoreHost = /(^|\.)play\.google\.com$/i.test(url.hostname);
    if (isPlayStoreHost && url.pathname.includes('/store/apps/details')) {
      const id = url.searchParams.get('id');
      if (id && PACKAGE_NAME_RE.test(id)) return id;
      return null;
    }
  } catch {
    // not a URL — fall through
  }

  if (PACKAGE_NAME_RE.test(raw)) return raw;
  return null;
}

export function isValidPlayStoreInput(input: string): boolean {
  return extractPackageName(input) !== null;
}
