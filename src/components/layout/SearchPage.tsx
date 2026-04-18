"use client";

import { useState, useEffect, useCallback } from "react";
import type { AlgorithmMeta, SearchTrace } from "@/types/algorithm";
import { generateArray, shuffleArray } from "@/lib/utils/arrayUtils";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import SearchVisualizer from "@/components/visualizer/SearchVisualizer";
import PlayerControls from "@/components/controls/PlayerControls";
import ArrayControls from "@/components/controls/ArrayControls";
import StepScrubber from "@/components/controls/StepScrubber";
import { useAudio } from "@/hooks/useAudio";
import { getAlgorithmInfo } from "@/lib/algorithms/info";
import AlgorithmInfo from "@/components/info/AlgorithmInfo";
import CodeViewer from "@/components/info/CodeViewer";

interface Props {
  meta: AlgorithmMeta;
  generateTrace: (array: number[], target: number) => SearchTrace;
}

export default function SearchPage({ meta, generateTrace }: Props) {
  const [n, setN] = useState(24);
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [trace, setTrace] = useState<SearchTrace | null>(null);

  const {
    step,
    totalSteps,
    frame,
    playerState,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBack,
    scrubTo,
    reset,
  } = useAlgorithmPlayer(trace as any);

  const maxValue = array.length ? Math.max(...array) : 100;
  const { enabled: soundEnabled, toggle: toggleSound } = useAudio(
    frame as any,
    maxValue
  );

  const buildTrace = useCallback(
    (arr: number[], tgt: number) => {
      setTrace(generateTrace(arr, tgt) as any);
      reset();
    },
    [generateTrace, reset]
  );

  const initArray = useCallback(
    (size: number) => {
      const arr = shuffleArray(generateArray(size));
      const sorted = [...arr].sort((a, b) => a - b);
      const tgt = sorted[Math.floor(Math.random() * sorted.length)];
      setArray(arr);
      setTarget(tgt);
      buildTrace(arr, tgt);
    },
    [buildTrace]
  );

  useEffect(() => {
    initArray(n);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShuffle = () => initArray(n);
  const handleNChange = (newN: number) => {
    setN(newN);
    initArray(newN);
  };
  const handleTargetChange = (val: number) => {
    setTarget(val);
    buildTrace(array, val);
  };

  const searchFrame = frame as any;
  const result = trace as SearchTrace | null;
  const algorithmInfo = getAlgorithmInfo(meta.id);

  return (
    <div className="p-6 max-w-4xl flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {meta.name}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {meta.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-6 px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">N</span>
          <span className="text-sm font-mono text-[var(--color-text-primary)]">{n}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Time</span>
          <span className="text-sm font-mono text-[var(--color-text-primary)]">{meta.timeComplexity}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Comparisons</span>
          <span className="text-sm font-mono text-[var(--color-text-primary)]">{step}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Result</span>
          <span className={`text-sm font-mono ${result?.found ? "text-[var(--color-bar-sorted)]" : "text-[var(--color-text-muted)]"}`}>
            {result?.found ? `Found at index ${result.foundIndex}` : playerState === "done" ? "Not found" : "—"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-[var(--color-text-muted)] font-mono shrink-0">Target:</label>
        <input
          type="number"
          value={target}
          onChange={(e) => handleTargetChange(Number(e.target.value))}
          className="w-24 px-2 py-1 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent)]"
        />
        <span className="text-xs text-[var(--color-text-muted)]">
          (array range: 1–100)
        </span>
      </div>

      <SearchVisualizer frame={searchFrame} />

      <div className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <PlayerControls
            playerState={playerState}
            speed={speed}
            soundEnabled={soundEnabled}
            onPlay={play}
            onPause={pause}
            onStepBack={stepBack}
            onStepForward={stepForward}
            onSpeedChange={setSpeed}
            onSoundToggle={toggleSound}
          />
          <ArrayControls n={n} onNChange={handleNChange} onShuffle={handleShuffle} />
        </div>
        <StepScrubber step={step} totalSteps={totalSteps} onScrub={scrubTo} />
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
