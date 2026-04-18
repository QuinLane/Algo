"use client";

import type { SearchFrame } from "@/types/algorithm";

interface Props {
  frame: SearchFrame | null;
}

export default function SearchVisualizer({ frame }: Props) {
  if (!frame) {
    return (
      <div className="w-full h-32 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] text-sm">
        Enter a target and press play
      </div>
    );
  }

  const { array, current, low, mid, high, found, target } = frame;
  const max = Math.max(...array, 1);

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 overflow-x-auto">
        <div className="flex gap-1 items-end min-w-0">
          {array.map((v, i) => {
            const isCurrent = i === current;
            const isLow = i === low;
            const isMid = i === mid;
            const isHigh = i === high;
            const isFound = found && isCurrent;

            let bg = "bg-[var(--color-bar-default)]";
            if (isFound) bg = "bg-[var(--color-bar-sorted)]";
            else if (isCurrent) bg = "bg-[var(--color-bar-compared)]";
            else if (isMid) bg = "bg-[#a78bfa]";
            else if (isLow || isHigh) bg = "bg-[var(--color-bar-swapped)]";

            const heightPct = Math.max(10, (v / max) * 100);

            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <div
                  className={`w-full rounded-t ${bg} transition-colors`}
                  style={{ height: `${heightPct * 0.8}px` }}
                />
                <span className="text-[9px] font-mono text-[var(--color-text-muted)] truncate w-full text-center">
                  {v === target && !isFound ? (
                    <span className="text-[var(--color-accent)]">{v}</span>
                  ) : v}
                </span>
                <span className="text-[8px] font-mono h-3">
                  {isFound ? (
                    <span className="text-[var(--color-bar-sorted)]">✓</span>
                  ) : isMid ? (
                    <span className="text-[#a78bfa]">m</span>
                  ) : isLow ? (
                    <span className="text-[var(--color-bar-swapped)]">l</span>
                  ) : isHigh ? (
                    <span className="text-[var(--color-bar-swapped)]">h</span>
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 text-xs font-mono text-[var(--color-text-muted)]">
        <span><span className="text-[var(--color-bar-compared)]">■</span> current</span>
        {mid !== undefined && <span><span className="text-[#a78bfa]">■</span> mid (m)</span>}
        {low !== undefined && <span><span className="text-[var(--color-bar-swapped)]">■</span> low/high (l/h)</span>}
        <span><span className="text-[var(--color-bar-sorted)]">■</span> found</span>
      </div>
    </div>
  );
}
