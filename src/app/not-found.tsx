import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
      <p className="text-7xl font-bold text-[var(--color-accent)] font-mono">404</p>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Page not found</h2>
      <p className="text-sm text-[var(--color-text-muted)] max-w-sm">
        That route doesn't exist. Head back home to pick an algorithm.
      </p>
      <Link
        href="/"
        className="mt-2 px-4 py-2 rounded bg-[var(--color-accent)] text-black text-sm font-bold hover:bg-[var(--color-accent-hover)] transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
