"use client";

interface Props {
  n: number;
  onNChange: (n: number) => void;
  onShuffle: () => void;
}

export default function ArrayControls({ n, onNChange, onShuffle }: Props) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-xs text-[var(--color-text-muted)] font-mono">
          N: {n}
        </label>
        <input
          type="range"
          min={8}
          max={128}
          step={4}
          value={n}
          onChange={(e) => onNChange(Number(e.target.value))}
          className="w-28 accent-[var(--color-accent)]"
        />
      </div>
      <button
        onClick={onShuffle}
        className="px-3 py-1.5 rounded text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors font-mono"
      >
        Shuffle
      </button>
    </div>
  );
}
