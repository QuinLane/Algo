"use client";

interface Props {
  step: number;
  totalSteps: number;
  onScrub: (step: number) => void;
}

export default function StepScrubber({ step, totalSteps, onScrub }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <input
        type="range"
        min={0}
        max={Math.max(0, totalSteps - 1)}
        value={step}
        onChange={(e) => onScrub(Number(e.target.value))}
        className="w-full accent-[var(--color-accent)]"
      />
      <p className="text-xs text-[var(--color-text-muted)] font-mono text-right">
        Step {step + 1} / {totalSteps || 1}
      </p>
    </div>
  );
}
