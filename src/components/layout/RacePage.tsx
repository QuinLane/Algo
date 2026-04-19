"use client";

import { useState } from "react";

const ALGORITHMS = [
  { id: "bubble-sort", name: "Bubble Sort" },
  { id: "insertion-sort", name: "Insertion Sort" },
  { id: "selection-sort", name: "Selection Sort" },
  { id: "merge-sort", name: "Merge Sort" },
  { id: "quick-sort", name: "Quick Sort" },
  { id: "heap-sort", name: "Heap Sort" },
];

export default function RacePage() {
  const [n, setN] = useState(32);
  const [leftId, setLeftId] = useState("bubble-sort");
  const [rightId, setRightId] = useState("quick-sort");

  return (
    <div className="p-6 max-w-6xl flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Race Mode</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Run two sorting algorithms side-by-side on the same data.
        </p>
      </div>

      {/* Algorithm selectors */}
      <div className="flex gap-4 flex-wrap items-end">
        <div className="flex-1 min-w-40">
          <label className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Left</label>
          <select
            value={leftId}
            onChange={(e) => setLeftId(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-mono focus:outline-none focus:border-[var(--color-accent)]"
          >
            {ALGORITHMS.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="text-[var(--color-text-muted)] text-sm font-bold pb-2">vs</div>

        <div className="flex-1 min-w-40">
          <label className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Right</label>
          <select
            value={rightId}
            onChange={(e) => setRightId(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-mono focus:outline-none focus:border-[var(--color-accent)]"
          >
            {ALGORITHMS.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 pb-0.5">
          <span className="text-xs text-[var(--color-text-muted)] font-mono">N: {n}</span>
          <input
            type="range"
            min={8}
            max={128}
            step={4}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-28 accent-[var(--color-accent)]"
          />
        </div>
      </div>

      {/* Panel placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[leftId, rightId].map((id) => {
          const algo = ALGORITHMS.find((a) => a.id === id)!;
          return (
            <div key={id} className="flex flex-col gap-2 rounded-xl p-3 border border-[var(--color-border)]">
              <span className="text-sm font-bold text-[var(--color-text-primary)]">{algo.name}</span>
              <div className="w-full h-64 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] text-sm">
                Press play to start
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
