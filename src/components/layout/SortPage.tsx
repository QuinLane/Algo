"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { AlgorithmMeta, SortTrace } from "@/types/algorithm";
import { generateArray, shuffleArray } from "@/lib/utils/arrayUtils";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import BarVisualizer from "@/components/visualizer/BarVisualizer";
import VisualizerSwitcher, {
  type VizMode,
} from "@/components/visualizer/VisualizerSwitcher";
import PlayerControls from "@/components/controls/PlayerControls";
import ArrayControls from "@/components/controls/ArrayControls";
import StepScrubber from "@/components/controls/StepScrubber";
import AlgorithmStats from "@/components/stats/AlgorithmStats";
import { useAudio } from "@/hooks/useAudio";

interface Props {
  meta: AlgorithmMeta;
  generateTrace: (array: number[]) => SortTrace;
  hasAuxiliary?: boolean;
}

export default function SortPage({
  meta,
  generateTrace,
  hasAuxiliary = false,
}: Props) {
  const [n, setN] = useState(32);
  const [mode, setMode] = useState<VizMode>("bar");
  const [trace, setTrace] = useState<SortTrace | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const elapsedRef = useRef<number | null>(null);

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
  } = useAlgorithmPlayer(trace);

  const maxValue = trace ? Math.max(...(trace.frames[0]?.array ?? [1])) : 100;
  const { enabled: soundEnabled, toggle: toggleSound } = useAudio(frame, maxValue);

  const buildTrace = useCallback(
    (size: number) => {
      const arr = shuffleArray(generateArray(size));
      setTrace(generateTrace(arr));
      reset();
      setElapsedMs(0);
    },
    [generateTrace, reset]
  );

  useEffect(() => {
    buildTrace(n);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // elapsed timer
  useEffect(() => {
    if (playerState === "playing") {
      if (!startTime) setStartTime(Date.now() - elapsedMs);
      elapsedRef.current = window.setInterval(() => {
        setElapsedMs(Date.now() - startTime);
      }, 100);
    } else {
      if (elapsedRef.current) {
        clearInterval(elapsedRef.current);
        elapsedRef.current = null;
      }
    }
    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [playerState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShuffle = () => buildTrace(n);
  const handleNChange = (newN: number) => {
    setN(newN);
    buildTrace(newN);
  };

  const handlePlay = () => {
    setStartTime(Date.now() - elapsedMs);
    play();
  };

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

      <AlgorithmStats
        meta={meta}
        trace={trace}
        step={step}
        elapsedMs={elapsedMs}
        n={n}
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <VisualizerSwitcher mode={mode} onChange={setMode} />
      </div>

      <BarVisualizer frame={frame} mode={mode} showAuxiliary={hasAuxiliary} />

      <div className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <PlayerControls
            playerState={playerState}
            speed={speed}
            soundEnabled={soundEnabled}
            onPlay={handlePlay}
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
    </div>
  );
}
