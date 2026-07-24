import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function Navbar({ children }: { children?: ReactNode }) {
  return (
    <header className="glass sticky top-0 z-50 w-full border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-sky-400 shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
            <Sparkles className="size-4.5 text-white" strokeWidth={2.25} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            PlayReview <span className="text-secondary">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
