"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import type { AlgorithmMeta } from "@/types/algorithm";

const PREVIEW_BARS = 16;
const COLORS = ["var(--color-bar-default)", "var(--color-bar-compared)", "var(--color-bar-swapped)", "var(--color-bar-sorted)"];

function MiniPreview() {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: PREVIEW_BARS }, () => Math.random())
  );
  const [highlights, setHighlights] = useState<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    const animate = (ts: number) => {
      if (ts - tickRef.current > 120) {
        tickRef.current = ts;
        frame++;
        const i = Math.floor(Math.random() * PREVIEW_BARS);
        const j = (i + 1) % PREVIEW_BARS;
        setHighlights([i, j]);
        if (frame % 3 === 0) {
          setBars((prev) => {
            const next = [...prev];
            [next[i], next[j]] = [next[j], next[i]];
            return next;
          });
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <svg viewBox={`0 0 ${PREVIEW_BARS} 1`} preserveAspectRatio="none" className="w-full h-10">
      {bars.map((v, i) => (
        <rect
          key={i}
          x={i} y={1 - v} width={0.85} height={v}
          fill={highlights.includes(i) ? "var(--color-bar-compared)" : "var(--color-bar-default)"}
          style={{ transition: "fill 0.1s ease, y 0.1s ease, height 0.1s ease" }}
        />
      ))}
    </svg>
  );
}

export default function AlgorithmCard({ algo }: { algo: AlgorithmMeta }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={algo.route}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)] hover:-translate-y-0.5 transition-all duration-150 group"
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
      {algo.category === "sort" && (
        <div className="mt-3 h-10 overflow-hidden rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {hovered && <MiniPreview />}
        </div>
      )}
      {algo.category !== "sort" && (
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">Space: {algo.spaceComplexity}</p>
      )}
    </Link>
  );
}
