"use client";

import { useState, useEffect, useCallback } from "react";
import type { AlgorithmMeta, PathfindingTrace } from "@/types/algorithm";
import type { GridData, GridPreset } from "@/lib/utils/gridUtils";
import { generateEmptyGrid, generateMaze, GRID_PRESETS } from "@/lib/utils/gridUtils";
import { useGridPlayer } from "@/hooks/useGridPlayer";
import GridVisualizer from "@/components/visualizer/GridVisualizer";
import PlayerControls from "@/components/controls/PlayerControls";
import StepScrubber from "@/components/controls/StepScrubber";
import { getAlgorithmInfo } from "@/lib/algorithms/info";
import AlgorithmInfo from "@/components/info/AlgorithmInfo";
import CodeViewer from "@/components/info/CodeViewer";

interface Props {
  meta: AlgorithmMeta;
  generateTrace: (data: GridData) => PathfindingTrace;
}

export default function PathfindingPage({ meta, generateTrace }: Props) {
  const [preset, setPreset] = useState<GridPreset>("medium");
  const [gridData, setGridData] = useState<GridData | null>(null);
  const [trace, setTrace] = useState<PathfindingTrace | null>(null);

  const { step, totalSteps, frame, playerState, speed, setSpeed, play, pause, stepForward, stepBack, scrubTo, reset } =
    useGridPlayer(trace);

  const isEditing = playerState === "idle" || playerState === "done";

  const buildTrace = useCallback(
    (data: GridData) => {
      setTrace(generateTrace(data));
      reset();
    },
    [generateTrace, reset]
  );

  const handleNewGrid = useCallback(() => {
    const { rows, cols } = GRID_PRESETS[preset];
    const data = generateEmptyGrid(rows, cols);
    setGridData(data);
    buildTrace(data);
  }, [preset, buildTrace]);

  const handleMaze = useCallback(() => {
    const { rows, cols } = GRID_PRESETS[preset];
    const data = generateMaze(rows, cols);
    setGridData(data);
    buildTrace(data);
  }, [preset, buildTrace]);

  const handlePresetChange = useCallback(
    (p: GridPreset) => {
      setPreset(p);
      const { rows, cols } = GRID_PRESETS[p];
      const data = generateEmptyGrid(rows, cols);
      setGridData(data);
      buildTrace(data);
    },
    [buildTrace]
  );

  const handleCellDraw = useCallback(
    (row: number, col: number, mode: "wall" | "erase") => {
      if (!gridData) return;
      setGridData((prev) => {
        if (!prev) return prev;
        const newGrid = prev.grid.map((r) => r.map((c) => ({ ...c })));
        newGrid[row][col].state = mode === "wall" ? "wall" : "empty";
        return { ...prev, grid: newGrid };
      });
    },
    [gridData]
  );

  const handleDrawEnd = useCallback(() => {
    setGridData((prev) => {
      if (!prev) return prev;
      setTrace(generateTrace(prev));
      reset();
      return prev;
    });
  }, [generateTrace, reset]);

  useEffect(() => {
    const { rows, cols } = GRID_PRESETS[preset];
    const data = generateEmptyGrid(rows, cols);
    setGridData(data);
    setTrace(generateTrace(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const algorithmInfo = getAlgorithmInfo(meta.id);
  const nodesExplored = trace?.nodesExplored ?? 0;
  const pathLength = trace?.pathLength ?? 0;
  const pathFound = trace?.pathFound ?? false;

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
          { label: "Nodes explored", value: nodesExplored },
          { label: "Path length", value: pathFound ? pathLength : "—" },
          { label: "Path found", value: pathFound ? "Yes" : trace ? "No" : "—" },
          { label: "Step", value: `${step + 1} / ${totalSteps || 1}` },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{label}</span>
            <span className={`text-sm font-mono ${label === "Path found" && pathFound ? "text-[var(--color-accent)]" : label === "Path found" && trace && !pathFound ? "text-red-400" : "text-[var(--color-text-primary)]"}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {gridData && (
        <GridVisualizer
          gridData={gridData}
          frame={isEditing ? null : frame}
          isEditing={isEditing}
          onCellDraw={handleCellDraw}
          onDrawEnd={handleDrawEnd}
        />
      )}

      <div className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
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
            <div className="flex rounded overflow-hidden border border-[var(--color-border)]">
              {(["small", "medium", "large"] as GridPreset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePresetChange(p)}
                  className={`px-2 py-1 text-xs font-mono capitalize transition-colors ${
                    preset === p
                      ? "bg-[var(--color-accent)] text-[#030712]"
                      : "bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={handleMaze}
              className="px-3 py-1.5 rounded text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors font-mono"
            >
              Generate Maze
            </button>
            <button
              onClick={handleNewGrid}
              className="px-3 py-1.5 rounded text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors font-mono"
            >
              Clear
            </button>
          </div>
        </div>
        <StepScrubber step={step} totalSteps={totalSteps} onScrub={scrubTo} />
        {isEditing && (
          <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
            Click or drag on the grid to draw walls · Press play to run the algorithm
          </p>
        )}
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
