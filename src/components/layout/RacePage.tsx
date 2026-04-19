"use client";

import { useState, useCallback, useEffect } from "react";
import { bubbleSort } from "@/lib/algorithms/sorting/bubble";
import { insertionSort } from "@/lib/algorithms/sorting/insertion";
import { selectionSort } from "@/lib/algorithms/sorting/selection";
import { mergeSort } from "@/lib/algorithms/sorting/merge";
import { quickSort } from "@/lib/algorithms/sorting/quick";
import { heapSort } from "@/lib/algorithms/sorting/heap";
import { generateArray, shuffleArray } from "@/lib/utils/arrayUtils";
import { useAlgorithmPlayer } from "@/hooks/useAlgorithmPlayer";
import BarVisualizer from "@/components/visualizer/BarVisualizer";
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

export default function RacePage() {
  const [n, setN] = useState(32);
  const [leftId, setLeftId] = useState("bubble-sort");
  const [rightId, setRightId] = useState("quick-sort");
  const [leftTrace, setLeftTrace] = useState<SortTrace | null>(null);
  const [rightTrace, setRightTrace] = useState<SortTrace | null>(null);
  const [speed, setSpeedState] = useState(1);

  const leftPlayer = useAlgorithmPlayer(leftTrace);
  const rightPlayer = useAlgorithmPlayer(rightTrace);

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
  };

  const handleShuffle = () => buildTraces(n, leftId, rightId);

  const handleNChange = (newN: number) => {
    setN(newN);
    buildTraces(newN, leftId, rightId);
  };

  const handleLeftIdChange = (id: string) => {
    setLeftId(id);
    buildTraces(n, id, rightId);
  };

  const handleRightIdChange = (id: string) => {
    setRightId(id);
    buildTraces(n, leftId, id);
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
        <div className="flex flex-col gap-2 rounded-xl p-3 border border-[var(--color-border)]">
          <span className="text-sm font-bold text-[var(--color-text-primary)]">{leftAlgo.name}</span>
          <BarVisualizer frame={leftPlayer.frame} />
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-3 border border-[var(--color-border)]">
          <span className="text-sm font-bold text-[var(--color-text-primary)]">{rightAlgo.name}</span>
          <BarVisualizer frame={rightPlayer.frame} />
        </div>
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
