import { useSyncExternalStore } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Every review carries a unique avatar on play-lh.googleusercontent.com. Scrolling a list of
 * thousands fires a request per card, and Google answers 429 Too Many Requests once the rate gets
 * high enough — after which every further request is wasted and still costs a connection.
 *
 * Radix already falls back to initials when an image fails, so the UI never breaks; the problem is
 * purely the request storm. This trips a breaker after a run of failures and serves initials for a
 * cooldown, then quietly tries again.
 */
const FAILURE_LIMIT = 8;
const COOLDOWN_MS = 5 * 60_000;

let failures = 0;
let blockedUntil = 0;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function reportFailure(): void {
  if (Date.now() < blockedUntil) return;
  if (++failures < FAILURE_LIMIT) return;
  failures = 0;
  blockedUntil = Date.now() + COOLDOWN_MS;
  emit();
  // re-render once the cooldown lapses so avatars come back on their own
  setTimeout(emit, COOLDOWN_MS);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => blockedUntil;

export function ReviewAvatar({ src, userName }: { src: string; userName: string }) {
  const until = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const allowed = src && Date.now() >= until;

  return (
    <Avatar>
      {allowed ? (
        <AvatarImage
          src={src}
          alt=""
          // the browser skips off-screen requests entirely, which matters most while scrolling fast
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoadingStatusChange={(status) => {
            if (status === 'error') reportFailure();
          }}
        />
      ) : null}
      <AvatarFallback>{userName.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
