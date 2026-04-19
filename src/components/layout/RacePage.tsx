"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { bubbleSort } from "@/lib/algorithms/sorting/bubble";
import { insertionSort } from "@/lib/algorithms/sorting/insertion";
import { selectionSort } from "@/lib/algorithms/sorting/selection";
import { mergeSort } from "@/lib/algorithms/sorting/merge";
import { quickSort } from "@/lib/algorithms/sorting/quick";
import { heapSort } from "@/lib/algorithms/sorting/heap";
import { generateArray, shuffleArray } from "@/lib/utils/arrayUtils";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import BarVisualizer from "@/components/visualizer/BarVisualizer";
import { useRaceAudio } from "@/hooks/useRaceAudio";
import type { SortTrace } from "@/types/algorithm";

const ALGORITHMS = [
  { id: "bubble-sort", name: "Bubble Sort", fn: bubbleSort },
  { id: "insertion-sort", name: "Insertion Sort", fn: insertionSort },
  { id: "selection-sort", name: "Selection Sort", fn: selectionSort },
  { id: "merge-sort", name: "Merge Sort", fn: mergeSort },
  { id: "quick-sort", name: "Quick Sort", fn: quickSort },
  { id: "heap-sort", name: "Heap Sort", fn: heapSort },
];

const SPEEDS = [0.25, 0.5, 1, 2, 4];

function liveStats(trace: SortTrace | null, step: number) {
  if (!trace) return { comparisons: 0, writes: 0 };
  const ratio = (step + 1) / trace.frames.length;
  return {
    comparisons: Math.round(trace.comparisons * ratio),
    writes: Math.round(trace.writes * ratio),
  };
}

export default function RacePage() {
  const [n, setN] = useState(32);
  const [leftId, setLeftId] = useState("bubble-sort");
  const [rightId, setRightId] = useState("quick-sort");
  const [leftTrace, setLeftTrace] = useState<SortTrace | null>(null);
  const [rightTrace, setRightTrace] = useState<SortTrace | null>(null);
  const [speed, setSpeedState] = useState(1);
  const [winner, setWinner] = useState<"left" | "right" | "tie" | null>(null);

  const leftPlayer = useAlgorithmPlayer(leftTrace);
  const rightPlayer = useAlgorithmPlayer(rightTrace);

  const maxValue = useMemo(
    () => Math.max(...(leftTrace?.frames[0]?.array ?? [100])),
    [leftTrace]
  );
  const { enabled: soundEnabled, toggle: toggleSound } = useRaceAudio(
    leftPlayer.frame,
    rightPlayer.frame,
    maxValue
  );

  const buildTraces = useCallback((size: number, lId: string, rId: string) => {
    const arr = shuffleArray(generateArray(size));
    const lFn = ALGORITHMS.find((a) => a.id === lId)!.fn;
    const rFn = ALGORITHMS.find((a) => a.id === rId)!.fn;
    setLeftTrace(lFn([...arr]));
    setRightTrace(rFn([...arr]));
  }, []);

  useEffect(() => {
    buildTraces(n, leftId, rightId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // winner detection — fires whenever either player finishes
  useEffect(() => {
    if (winner !== null) return;
    const ld = leftPlayer.playerState === "done";
    const rd = rightPlayer.playerState === "done";
    if (ld && rd) setWinner("tie");
    else if (ld) setWinner("left");
    else if (rd) setWinner("right");
  }, [leftPlayer.playerState, rightPlayer.playerState, winner]);

  const handlePlay = () => {
    leftPlayer.play();
    rightPlayer.play();
  };

  const handlePause = () => {
    leftPlayer.pause();
    rightPlayer.pause();
  };

  const handleReset = () => {
    leftPlayer.reset();
    rightPlayer.reset();
    setWinner(null);
  };

  const handleShuffle = () => {
    buildTraces(n, leftId, rightId);
    setWinner(null);
  };

  const handleNChange = (newN: number) => {
    setN(newN);
    buildTraces(newN, leftId, rightId);
  };

  const handleLeftIdChange = (id: string) => {
    setLeftId(id);
    buildTraces(n, id, rightId);
    setWinner(null);
  };

  const handleRightIdChange = (id: string) => {
    setRightId(id);
    buildTraces(n, leftId, id);
    setWinner(null);
  };

  const handleSpeedChange = (s: number) => {
    setSpeedState(s);
    leftPlayer.setSpeed(s);
    rightPlayer.setSpeed(s);
  };

  const isPlaying =
    leftPlayer.playerState === "playing" || rightPlayer.playerState === "playing";

  const leftAlgo = ALGORITHMS.find((a) => a.id === leftId)!;
  const rightAlgo = ALGORITHMS.find((a) => a.id === rightId)!;
  const leftSt = liveStats(leftTrace, leftPlayer.step);
  const rightSt = liveStats(rightTrace, rightPlayer.step);

  return (
    <div className="p-6 max-w-6xl flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Race Mode</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Run two sorting algorithms side-by-side on the same data.
        </p>
      </div>

      {/* Algorithm selectors */}
      <div className="flex gap-4 flex-wrap items-end">
        <div className="flex-1 min-w-40">
          <label className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Left</label>
          <select
            value={leftId}
            onChange={(e) => handleLeftIdChange(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-mono focus:outline-none focus:border-[var(--color-accent)]"
          >
            {ALGORITHMS.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="text-[var(--color-text-muted)] text-sm font-bold pb-2">vs</div>

        <div className="flex-1 min-w-40">
          <label className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">Right</label>
          <select
            value={rightId}
            onChange={(e) => handleRightIdChange(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-mono focus:outline-none focus:border-[var(--color-accent)]"
          >
            {ALGORITHMS.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 pb-0.5">
          <span className="text-xs text-[var(--color-text-muted)] font-mono">N: {n}</span>
          <input
            type="range"
            min={8}
            max={128}
            step={4}
            value={n}
            onChange={(e) => handleNChange(Number(e.target.value))}
            className="w-28 accent-[var(--color-accent)]"
          />
          <button
            onClick={handleShuffle}
            className="px-3 py-1.5 rounded text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-all duration-100 active:scale-95 font-mono"
          >
            Shuffle
          </button>
        </div>
      </div>

      {/* Visualizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(
          [
            { algo: leftAlgo, player: leftPlayer, st: leftSt, side: "left" as const },
            { algo: rightAlgo, player: rightPlayer, st: rightSt, side: "right" as const },
          ] as const
        ).map(({ algo, player, st, side }) => {
          const isWinner = winner === side;
          const isTie = winner === "tie";
          return (
            <div
              key={side}
              className={`flex flex-col gap-2 rounded-xl p-3 border transition-colors duration-300 ${
                isWinner
                  ? "border-[var(--color-accent)] shadow-[0_0_16px_rgba(34,211,238,0.12)]"
                  : "border-[var(--color-border)]"
              }`}
            >
              <div className="flex items-center justify-between h-6">
                <span className="text-sm font-bold text-[var(--color-text-primary)]">{algo.name}</span>
                {isWinner && (
                  <span className="text-xs font-bold text-[var(--color-accent)] px-2 py-0.5 rounded bg-[var(--color-accent)]/10">
                    WINNER
                  </span>
                )}
                {isTie && (
                  <span className="text-xs text-[var(--color-text-muted)] px-2 py-0.5 rounded bg-[var(--color-border)]">
                    TIE
                  </span>
                )}
              </div>
              <BarVisualizer frame={player.frame} />
              <div className="flex gap-4 text-[10px] font-mono text-[var(--color-text-muted)] px-1">
                <span>
                  Comparisons:{" "}
                  <span className="text-[var(--color-text-primary)]">{st.comparisons}</span>
                </span>
                <span>
                  Writes:{" "}
                  <span className="text-[var(--color-text-primary)]">{st.writes}</span>
                </span>
                <span>
                  Step:{" "}
                  <span className="text-[var(--color-text-primary)]">
                    {player.step}/{Math.max(0, player.totalSteps - 1)}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="w-10 h-10 flex items-center justify-center rounded bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black font-bold transition-all duration-100 active:scale-90 text-base"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-all duration-100 active:scale-95 text-sm font-mono"
        >
          Reset
        </button>
        <button
          onClick={toggleSound}
          className={`w-8 h-8 flex items-center justify-center rounded border transition-all duration-100 active:scale-90 text-sm ${
            soundEnabled
              ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-black"
              : "bg-[var(--color-bg-card)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]"
          }`}
          title={soundEnabled ? "Mute" : "Unmute"}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>
        <div className="flex items-center gap-1 ml-2">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
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
    </div>
  );
}
