"use client";

import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

interface Props {
  content: AlgorithmInfoContent["explanation"];
}

export default function AlgorithmInfo({ content }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-5">
        <h2 className="text-base font-semibold text-[var(--color-accent)] mb-3">Overview</h2>
        <p className="text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line">
          {content.overview}
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-5">
          <h2 className="text-base font-semibold text-[var(--color-accent)] mb-3">How It Works</h2>
          <ol className="flex flex-col gap-2">
            {content.howItWorks.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-[var(--color-text-primary)]">
                <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[10px] font-mono text-[var(--color-accent)] mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-5">
          <h2 className="text-base font-semibold text-[var(--color-accent)] mb-3">Use Cases</h2>
          <ul className="flex flex-col gap-2">
            {content.useCases.map((use, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--color-text-primary)] leading-relaxed">
                <span className="text-[var(--color-accent)] shrink-0 mt-1">›</span>
                {use}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-5">
        <h2 className="text-base font-semibold text-[var(--color-accent)] mb-3">Complexity Analysis</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              { label: "Best", entry: content.complexity.time.best },
              { label: "Average", entry: content.complexity.time.average },
              { label: "Worst", entry: content.complexity.time.worst },
              { label: "Space", entry: content.complexity.space },
            ] as const
          ).map(({ label, entry }) => (
            <div
              key={label}
              className="flex flex-col gap-1 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] p-3"
            >
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{label}</span>
              <span className="text-lg font-mono font-bold text-[var(--color-text-primary)]">{entry.value}</span>
              <span className="text-xs text-[var(--color-text-muted)] leading-snug">{entry.note}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
