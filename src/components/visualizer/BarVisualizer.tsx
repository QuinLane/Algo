"use client";

import { useState, useRef, useEffect } from "react";
import type { SortFrame } from "@/types/algorithm";

export type BarMode = "bar" | "arcs";

interface Arc {
  id: number;
  x1: number;
  x2: number;
  height: number;
  color: string;
}

interface Props {
  frame: SortFrame | null;
  mode?: BarMode;
  showAuxiliary?: boolean;
}

function arcColor(distRatio: number): string {
  if (distRatio < 0.15) return "var(--color-accent)";
  if (distRatio < 0.4) return "#fb923c";
  return "#f87171";
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
  arcs,
}: {
  array: number[];
  frame: SortFrame;
  hoveredBar: number | null;
  arcs: Arc[];
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
      {arcs.map((arc) => {
        const mx = (arc.x1 + arc.x2) / 2;
        return (
          <path
            key={arc.id}
            d={`M ${arc.x1} 100 Q ${mx} ${100 - arc.height} ${arc.x2} 100`}
            stroke={arc.color}
            strokeWidth={0.5}
            fill="none"
            style={{ animation: "arcFade 0.6s ease forwards" }}
          />
        );
      })}
    </svg>
  );
}

export default function BarVisualizer({ frame, mode = "bar", showAuxiliary = false }: Props) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number } | null>(null);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const arcIdRef = useRef(0);

  useEffect(() => {
    if (mode !== "arcs" || !frame || frame.swapped.length < 2) return;
    const [i, j] = frame.swapped;
    const n = frame.array.length;
    const distRatio = Math.abs(j - i) / n;
    const height = distRatio * 75 + 8;
    const id = ++arcIdRef.current;

    setArcs((prev) => [
      ...prev,
      { id, x1: i + 0.45, x2: j + 0.45, height, color: arcColor(distRatio) },
    ]);

    const t = setTimeout(() => setArcs((prev) => prev.filter((a) => a.id !== id)), 660);
    return () => clearTimeout(t);
  }, [frame, mode]);

  // clear arcs when switching away from arc mode
  useEffect(() => {
    if (mode !== "arcs") setArcs([]);
  }, [mode]);

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
        <Bars
          array={frame.array}
          frame={frame}
          hoveredBar={hoveredBar}
          arcs={mode === "arcs" ? arcs : []}
        />
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
          <Bars
            array={frame.auxiliary}
            frame={{ ...frame, compared: [], swapped: [] }}
            hoveredBar={null}
            arcs={[]}
          />
        </div>
      )}
    </div>
  );
}
