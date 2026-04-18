"use client";

import type { SortFrame } from "@/types/algorithm";
import { valueToHsl } from "@/lib/utils/colorUtils";

type Mode = "bar" | "heatmap" | "scatter";

interface Props {
  frame: SortFrame | null;
  mode?: Mode;
  showAuxiliary?: boolean;
}

function barColor(
  index: number,
  value: number,
  max: number,
  frame: SortFrame,
  mode: Mode
): string {
  if (mode === "heatmap") return valueToHsl(value, max);
  if (frame.sorted.includes(index)) return "var(--color-bar-sorted)";
  if (frame.swapped.includes(index)) return "var(--color-bar-swapped)";
  if (frame.compared.includes(index)) return "var(--color-bar-compared)";
  if (frame.pivot === index) return "#a78bfa";
  return "var(--color-bar-default)";
}

function scatterDot(
  index: number,
  value: number,
  max: number,
  frame: SortFrame
): string {
  if (frame.sorted.includes(index)) return "var(--color-bar-sorted)";
  if (frame.swapped.includes(index)) return "var(--color-bar-swapped)";
  if (frame.compared.includes(index)) return "var(--color-bar-compared)";
  if (frame.pivot === index) return "#a78bfa";
  return "var(--color-bar-default)";
  void max;
}

function Bars({
  array,
  frame,
  mode,
}: {
  array: number[];
  frame: SortFrame;
  mode: Mode;
}) {
  const max = Math.max(...array, 1);
  const n = array.length;

  if (mode === "scatter") {
    return (
      <svg
        viewBox={`0 0 ${n} 100`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {array.map((v, i) => (
          <circle
            key={i}
            cx={i + 0.5}
            cy={100 - (v / max) * 98}
            r={Math.max(0.4, 50 / n)}
            fill={scatterDot(i, v, max, frame)}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${n} 100`}
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      {array.map((v, i) => {
        const h = (v / max) * 100;
        return (
          <rect
            key={i}
            x={i}
            y={100 - h}
            width={0.9}
            height={h}
            fill={barColor(i, v, max, frame, mode)}
          />
        );
      })}
    </svg>
  );
}

export default function BarVisualizer({
  frame,
  mode = "bar",
  showAuxiliary = false,
}: Props) {
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
        <Bars array={frame.array} frame={frame} mode={mode} />
      </div>
      {showAuxiliary && frame.auxiliary && frame.auxiliary.length > 0 && (
        <div className="w-full h-20 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-2 opacity-70">
          <Bars array={frame.auxiliary} frame={{ ...frame, compared: [], swapped: [] }} mode={mode} />
        </div>
      )}
    </div>
  );
}
