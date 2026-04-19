"use client";

import type { SortFrame } from "@/types/algorithm";

interface Props {
  frame: SortFrame | null;
  showAuxiliary?: boolean;
}

function barColor(index: number, frame: SortFrame): string {
  if (frame.sorted.includes(index)) return "var(--color-bar-sorted)";
  if (frame.swapped.includes(index)) return "var(--color-bar-swapped)";
  if (frame.compared.includes(index)) return "var(--color-bar-compared)";
  if (frame.pivot === index) return "#a78bfa";
  return "var(--color-bar-default)";
}

function Bars({ array, frame }: { array: number[]; frame: SortFrame }) {
  const max = Math.max(...array, 1);
  const n = array.length;
  return (
    <svg viewBox={`0 0 ${n} 100`} preserveAspectRatio="none" className="w-full h-full">
      {array.map((v, i) => {
        const h = (v / max) * 100;
        return (
          <rect
            key={i}
            x={i}
            y={100 - h}
            width={0.9}
            height={h}
            fill={barColor(i, frame)}
            style={{ transition: "fill 0.08s ease, y 0.06s ease, height 0.06s ease" }}
          />
        );
      })}
    </svg>
  );
}

export default function BarVisualizer({ frame, showAuxiliary = false }: Props) {
  if (!frame) {
    return (
      <div className="w-full h-64 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] text-sm">
        Press play to start
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-64 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-2">
        <Bars array={frame.array} frame={frame} />
      </div>
      {showAuxiliary && frame.auxiliary && frame.auxiliary.length > 0 && (
        <div className="w-full h-20 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-2 opacity-70">
          <Bars array={frame.auxiliary} frame={{ ...frame, compared: [], swapped: [] }} />
        </div>
      )}
    </div>
  );
}
