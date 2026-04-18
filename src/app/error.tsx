"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
      <p className="text-4xl font-bold text-[var(--color-bar-compared)] font-mono">Error</p>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Something went wrong</h2>
      <p className="text-sm text-[var(--color-text-muted)] max-w-sm font-mono">{error.message}</p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-4 py-2 rounded bg-[var(--color-accent)] text-black text-sm font-bold hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm hover:border-[var(--color-accent)] transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
