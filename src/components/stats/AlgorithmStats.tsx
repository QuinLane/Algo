"use client";

import type { AlgorithmMeta } from "@/types/algorithm";
import type { SortTrace } from "@/types/algorithm";

interface Props {
  meta: AlgorithmMeta;
  trace: SortTrace | null;
  step: number;
  elapsedMs: number;
  n: number;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
      <span className="text-sm font-mono text-[var(--color-text-primary)]">
        {value}
      </span>
    </div>
  );
}

export default function AlgorithmStats({
  meta,
  trace,
  step,
  elapsedMs,
  n,
}: Props) {
  const comparisons = trace
    ? Math.round((trace.comparisons / trace.frames.length) * (step + 1))
    : 0;
  const writes = trace
    ? Math.round((trace.writes / trace.frames.length) * (step + 1))
    : 0;

  return (
    <div className="flex flex-wrap gap-6 px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
      <Stat label="N" value={n} />
      <Stat label="Time" value={meta.timeComplexity} />
      <Stat label="Space" value={meta.spaceComplexity} />
      <Stat label="Comparisons" value={comparisons} />
      <Stat label="Writes" value={writes} />
      <Stat label="Elapsed" value={`${(elapsedMs / 1000).toFixed(1)}s`} />
    </div>
  );
}
