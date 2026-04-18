"use client";

import type { PlayerState } from "@/hooks/useAlgorithmPlayer";

const SPEEDS = [0.25, 0.5, 1, 2, 4];

interface Props {
  playerState: PlayerState;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onSpeedChange: (s: number) => void;
}

export default function PlayerControls({
  playerState,
  speed,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onSpeedChange,
}: Props) {
  const isPlaying = playerState === "playing";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={onStepBack}
        className="w-8 h-8 flex items-center justify-center rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-primary)] transition-colors text-sm"
        title="Step back"
      >
        ◀
      </button>

      <button
        onClick={isPlaying ? onPause : onPlay}
        className="w-10 h-10 flex items-center justify-center rounded bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black font-bold transition-colors text-base"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      <button
        onClick={onStepForward}
        className="w-8 h-8 flex items-center justify-center rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-primary)] transition-colors text-sm"
        title="Step forward"
      >
        ▶
      </button>

      <div className="flex items-center gap-1 ml-2">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
              speed === s
                ? "bg-[var(--color-accent)] text-black"
                : "bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
