"use client";

import { useState, useCallback, useMemo } from "react";
import type { AlgorithmMeta, DPTrace } from "@/types/algorithm";
import { useDPPlayer } from "@/hooks/useDPPlayer";
import DPTableVisualizer from "@/components/visualizer/DPTableVisualizer";
import PlayerControls from "@/components/controls/PlayerControls";
import StepScrubber from "@/components/controls/StepScrubber";
import { getAlgorithmInfo } from "@/lib/algorithms/info";
import AlgorithmInfo from "@/components/info/AlgorithmInfo";
import CodeViewer from "@/components/info/CodeViewer";

export type DPInputMode = "number" | "strings";

interface NumberInputProps {
  mode: "number";
  defaultN: number;
  maxN: number;
  generateTrace: (n: number) => DPTrace;
}

interface StringInputProps {
  mode: "strings";
  defaultA: string;
  defaultB: string;
  generateTrace: (a: string, b: string) => DPTrace;
}

type Props = { meta: AlgorithmMeta } & (NumberInputProps | StringInputProps);

export default function DPPage(props: Props) {
  const { meta } = props;

  const [nInput, setNInput] = useState(
    props.mode === "number" ? String(props.defaultN) : "10"
  );
  const [strA, setStrA] = useState(props.mode === "strings" ? props.defaultA : "");
  const [strB, setStrB] = useState(props.mode === "strings" ? props.defaultB : "");

  const [trace, setTrace] = useState<DPTrace | null>(() => {
    if (props.mode === "number") return props.generateTrace(props.defaultN);
    return props.generateTrace(props.defaultA, props.defaultB);
  });

  const { step, totalSteps, frame, playerState, speed, setSpeed, play, pause, stepForward, stepBack, scrubTo, reset } =
    useDPPlayer(trace);

  const handleRun = useCallback(() => {
    if (props.mode === "number") {
      const n = parseInt(nInput, 10);
      if (isNaN(n) || n < 1) return;
      setTrace(props.generateTrace(Math.min(n, props.maxN)));
    } else {
      const a = strA.trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 12);
      const b = strB.trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 12);
      if (!a || !b) return;
      setTrace(props.generateTrace(a, b));
    }
    reset();
  }, [props, nInput, strA, strB, reset]);

  const algorithmInfo = getAlgorithmInfo(meta.id);

  const displayMessage = useMemo(() => {
    if (!trace) return null;
    for (let i = step; i >= 0; i--) {
      const msg = trace.frames[i]?.message;
      if (msg) return msg;
    }
    return null;
  }, [trace, step]);

  const fills = frame?.fills ?? 0;
  const result = trace?.result ?? null;

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
          { label: "Cells filled", value: fills },
          { label: "Result", value: result ?? "—" },
          { label: "Step", value: `${step + 1} / ${totalSteps || 1}` },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{label}</span>
            <span className="text-sm font-mono text-[var(--color-text-primary)]">{value}</span>
          </div>
        ))}
      </div>

      <DPTableVisualizer frame={frame} trace={trace} />

      {displayMessage && (
        <div className="px-3 py-2 rounded bg-[var(--color-border)]">
          <p className="text-xs font-mono text-[var(--color-text-muted)]">{displayMessage}</p>
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
            {props.mode === "number" ? (
              <>
                <label className="text-xs font-mono text-[var(--color-text-muted)]">n =</label>
                <input
                  type="number"
                  min={1}
                  max={props.maxN}
                  value={nInput}
                  onChange={(e) => setNInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRun()}
                  className="w-20 px-3 py-1.5 rounded text-xs font-mono bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={strA}
                  onChange={(e) => setStrA(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRun()}
                  placeholder="String A"
                  className="w-32 px-3 py-1.5 rounded text-xs font-mono bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                />
                <input
                  type="text"
                  value={strB}
                  onChange={(e) => setStrB(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRun()}
                  placeholder="String B"
                  className="w-32 px-3 py-1.5 rounded text-xs font-mono bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                />
              </>
            )}
            <button
              onClick={handleRun}
              className="px-3 py-1.5 rounded text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors font-mono"
            >
              Run
            </button>
          </div>
        </div>

        <StepScrubber step={step} totalSteps={totalSteps} onScrub={scrubTo} />

        <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
          {props.mode === "number"
            ? `n from 1 to ${props.maxN} · Enter or Run to generate`
            : "Letters only, up to 12 chars each · Enter or Run to generate"}
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
