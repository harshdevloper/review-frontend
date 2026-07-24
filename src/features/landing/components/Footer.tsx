import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/60 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-secondary" />
          <span>PlayReview AI</span>
        </div>
        <p>Built for teams who read every review.</p>
      </div>
    </footer>
  );
}
