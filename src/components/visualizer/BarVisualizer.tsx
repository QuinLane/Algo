"use client";

import { useState, useRef } from "react";
import type { SortFrame } from "@/types/algorithm";

interface Props {
  frame: SortFrame | null;
  showAuxiliary?: boolean;
}

function barColor(index: number, frame: SortFrame, hoveredBar: number | null): string {
  if (hoveredBar === index) return "var(--color-accent)";
  if (frame.sorted.includes(index)) return "var(--color-bar-sorted)";
  if (frame.swapped.includes(index)) return "var(--color-bar-swapped)";
  if (frame.compared.includes(index)) return "var(--color-bar-compared)";
  if (frame.pivot === index) return "#a78bfa";
  return "var(--color-bar-default)";
}

function Bars({
  array,
  frame,
  hoveredBar,
}: {
  array: number[];
  frame: SortFrame;
  hoveredBar: number | null;
}) {
  const max = Math.max(...array, 1);
  const n = array.length;
  return (
    <svg viewBox={`0 0 ${n} 100`} preserveAspectRatio="none" className="w-full h-full">
      {array.map((v, i) => {
        const h = (v / max) * 100;
        const isHovered = hoveredBar === i;
        return (
          <rect
            key={i}
            x={i}
            y={100 - h - (isHovered ? 1.5 : 0)}
            width={0.9}
            height={h + (isHovered ? 1.5 : 0)}
            fill={barColor(i, frame, hoveredBar)}
            style={{ transition: "fill 0.15s ease, y 0.1s ease, height 0.1s ease" }}
          />
        );
      })}
    </svg>
  );
}

export default function BarVisualizer({ frame, showAuxiliary = false }: Props) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !frame) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const n = frame.array.length;
    const idx = Math.min(n - 1, Math.max(0, Math.floor((relX / rect.width) * n)));
    setHoveredBar(idx);
    setTooltip({ x: relX, y: e.clientY - rect.top, value: frame.array[idx] });
  };

  const handleMouseLeave = () => {
    setHoveredBar(null);
    setTooltip(null);
  };

  if (!frame) {
    return (
      <div className="w-full h-64 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] text-sm">
        Press play to start
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        className="relative w-full h-64 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-2"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Bars array={frame.array} frame={frame} hoveredBar={hoveredBar} />
        {tooltip && (
          <div
            className="absolute pointer-events-none z-10 px-2 py-0.5 rounded text-xs font-mono bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
            style={{
              left: Math.min(tooltip.x + 8, (containerRef.current?.clientWidth ?? 400) - 56),
              top: Math.max(4, tooltip.y - 28),
              animation: "fadeIn 0.15s ease forwards",
            }}
          >
            {tooltip.value}
          </div>
        )}
      </div>
      {showAuxiliary && frame.auxiliary && frame.auxiliary.length > 0 && (
        <div className="w-full h-20 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-2 opacity-70">
          <Bars array={frame.auxiliary} frame={{ ...frame, compared: [], swapped: [] }} hoveredBar={null} />
        </div>
      )}
    </div>
  );
}
