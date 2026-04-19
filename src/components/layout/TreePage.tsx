"use client";

import { useState, useCallback } from "react";
import type { AlgorithmMeta, TreeTrace } from "@/types/algorithm";
import { useTreePlayer } from "@/hooks/useTreePlayer";
import TreeVisualizer from "@/components/visualizer/TreeVisualizer";
import PlayerControls from "@/components/controls/PlayerControls";
import StepScrubber from "@/components/controls/StepScrubber";
import { getAlgorithmInfo } from "@/lib/algorithms/info";
import AlgorithmInfo from "@/components/info/AlgorithmInfo";
import CodeViewer from "@/components/info/CodeViewer";

export type TraversalType = "inorder" | "preorder" | "postorder";

const TRAVERSAL_LABELS: Record<TraversalType, string> = {
  inorder: "In-order",
  preorder: "Pre-order",
  postorder: "Post-order",
};

const DEFAULT_VALUES = [8, 3, 10, 1, 6, 14, 4, 7, 13];

function parseValues(input: string): number[] {
  return input
    .split(/[\s,]+/)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n >= 0 && n <= 999)
    .slice(0, 20);
}

interface Props {
  meta: AlgorithmMeta;
  showTraversalSelector?: boolean;
  generateTrace: (values: number[], traversalType?: TraversalType) => TreeTrace;
}

export default function TreePage({ meta, showTraversalSelector, generateTrace }: Props) {
  const [inputStr, setInputStr] = useState(DEFAULT_VALUES.join(", "));
  const [traversalType, setTraversalType] = useState<TraversalType>("inorder");
  const [trace, setTrace] = useState<TreeTrace | null>(() =>
    generateTrace(DEFAULT_VALUES, "inorder")
  );

  const { step, totalSteps, frame, playerState, speed, setSpeed, play, pause, stepForward, stepBack, scrubTo, reset } =
    useTreePlayer(trace);

  const handleBuild = useCallback(() => {
    const values = parseValues(inputStr);
    if (values.length === 0) return;
    setTrace(generateTrace(values, showTraversalSelector ? traversalType : undefined));
    reset();
  }, [inputStr, traversalType, showTraversalSelector, generateTrace, reset]);

  const handleTraversalChange = useCallback(
    (t: TraversalType) => {
      setTraversalType(t);
      const values = parseValues(inputStr);
      if (values.length === 0) return;
      setTrace(generateTrace(values, t));
      reset();
    },
    [inputStr, generateTrace, reset]
  );

  const algorithmInfo = getAlgorithmInfo(meta.id);
  const treeHeight = trace?.treeHeight ?? 0;

  return (
    <div className="p-6 max-w-4xl flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{meta.name}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{meta.description}</p>
      </div>

      <div className="flex flex-wrap gap-6 px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        {[
          { label: "Time", value: meta.timeComplexity },
          { label: "Space", value: meta.spaceComplexity },
          { label: "Tree height", value: treeHeight || "—" },
          { label: "Comparisons", value: frame?.comparisons ?? 0 },
          { label: "Step", value: `${step + 1} / ${totalSteps || 1}` },
          ...(showTraversalSelector
            ? [{ label: "Output", value: frame?.outputList?.length ?? 0 }]
            : []),
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              {label}
            </span>
            <span className="text-sm font-mono text-[var(--color-text-primary)]">{value}</span>
          </div>
        ))}
      </div>

      <TreeVisualizer frame={frame} />

      {showTraversalSelector && frame?.outputList && frame.outputList.length > 0 && (
        <div className="px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-mono">
            {TRAVERSAL_LABELS[traversalType]} output
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {frame.outputList.map((v, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-xs font-mono bg-[var(--color-border)] text-[var(--color-accent)]"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {frame?.message && (
        <div className="px-3 py-2 rounded bg-[var(--color-border)]">
          <p className="text-xs font-mono text-[var(--color-text-muted)]">{frame.message}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <PlayerControls
            playerState={playerState}
            speed={speed}
            soundEnabled={false}
            onPlay={play}
            onPause={pause}
            onStepBack={stepBack}
            onStepForward={stepForward}
            onSpeedChange={setSpeed}
            onSoundToggle={() => {}}
          />

          <div className="flex items-center gap-2 flex-wrap">
            {showTraversalSelector && (
              <div className="flex rounded overflow-hidden border border-[var(--color-border)]">
                {(["inorder", "preorder", "postorder"] as TraversalType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTraversalChange(t)}
                    className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                      traversalType === t
                        ? "bg-[var(--color-accent)] text-[#030712]"
                        : "bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {TRAVERSAL_LABELS[t]}
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuild()}
              placeholder="e.g. 5, 3, 7, 1, 4"
              className="px-3 py-1.5 rounded text-xs font-mono bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] w-48"
            />
            <button
              onClick={handleBuild}
              className="px-3 py-1.5 rounded text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors font-mono"
            >
              Build
            </button>
          </div>
        </div>

        <StepScrubber step={step} totalSteps={totalSteps} onScrub={scrubTo} />

        <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
          Enter up to 20 values (0–999), comma or space separated · Press Enter or Build
        </p>
      </div>

      {algorithmInfo && (
        <div className="flex flex-col gap-6 pt-2">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] border-t border-[var(--color-border)] pt-5">
            About {meta.name}
          </h2>
          <AlgorithmInfo content={algorithmInfo.explanation} />
          <CodeViewer code={algorithmInfo.code} />
        </div>
      )}
    </div>
  );
}
