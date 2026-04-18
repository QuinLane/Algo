"use client";

export type VizMode = "bar" | "heatmap" | "scatter";

const MODES: { id: VizMode; label: string }[] = [
  { id: "bar", label: "Bar" },
  { id: "heatmap", label: "Heatmap" },
  { id: "scatter", label: "Scatter" },
];

interface Props {
  mode: VizMode;
  onChange: (mode: VizMode) => void;
}

export default function VisualizerSwitcher({ mode, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
            mode === m.id
              ? "bg-[var(--color-accent)] text-black"
              : "bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
