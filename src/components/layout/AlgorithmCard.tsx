import Link from "next/link";
import type { AlgorithmMeta } from "@/types/algorithm";

export default function AlgorithmCard({ algo }: { algo: AlgorithmMeta }) {
  return (
    <Link
      href={algo.route}
      className="block p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)] transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
          {algo.name}
        </h3>
        <span className="shrink-0 text-xs text-[var(--color-text-muted)] font-mono bg-[var(--color-bg-primary)] px-2 py-0.5 rounded">
          {algo.timeComplexity}
        </span>
      </div>
      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
        {algo.description}
      </p>
      <p className="mt-3 text-xs text-[var(--color-text-muted)]">
        Space: {algo.spaceComplexity}
      </p>
    </Link>
  );
}
