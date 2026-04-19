"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { AlgorithmMeta, PathfindingTrace } from "@/types/algorithm";
import type { GridData, GridPreset } from "@/lib/utils/gridUtils";
import { generateEmptyGrid, generateMaze, GRID_PRESETS, cloneGrid } from "@/lib/utils/gridUtils";
import { useGridPlayer } from "@/hooks/useGridPlayer";
import { useGridAudio } from "@/hooks/useGridAudio";
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

const PRESET_LABELS: Record<GridPreset, string> = {
  small: `Small — ${GRID_PRESETS.small.rows}×${GRID_PRESETS.small.cols}`,
  medium: `Medium — ${GRID_PRESETS.medium.rows}×${GRID_PRESETS.medium.cols}`,
  large: `Large — ${GRID_PRESETS.large.rows}×${GRID_PRESETS.large.cols}`,
};

export default function PathfindingPage({ meta, generateTrace }: Props) {
  const [preset, setPreset] = useState<GridPreset>("medium");
  const [gridData, setGridData] = useState<GridData | null>(null);
  const [trace, setTrace] = useState<PathfindingTrace | null>(null);
  const [brushSize, setBrushSize] = useState(1);
  const [mazeOpen, setMazeOpen] = useState(false);
  const mazeMenuRef = useRef<HTMLDivElement>(null);

  const { step, totalSteps, frame, playerState, speed, setSpeed, play, pause, stepForward, stepBack, scrubTo, reset } =
    useGridPlayer(trace);

  const { enabled: soundEnabled, toggle: toggleSound } = useGridAudio(
    playerState !== "idle" ? frame : null,
    gridData
  );

  const isEditing = playerState === "idle" || playerState === "done";

  const buildTrace = useCallback(
    (data: GridData) => {
      setTrace(generateTrace(data));
      reset();
    },
    [generateTrace, reset]
  );

  const handleMaze = useCallback(
    (p: GridPreset = preset) => {
      setPreset(p);
      setMazeOpen(false);
      const { rows, cols } = GRID_PRESETS[p];
      const data = generateMaze(rows, cols);
      setGridData(data);
      buildTrace(data);
    },
    [preset, buildTrace]
  );

  const handleClear = useCallback(() => {
    const { rows, cols } = GRID_PRESETS[preset];
    const data = generateEmptyGrid(rows, cols);
    setGridData(data);
    buildTrace(data);
  }, [preset, buildTrace]);

  const handleCellDraw = useCallback(
    (centerRow: number, centerCol: number, mode: "wall" | "erase") => {
      setGridData((prev) => {
        if (!prev) return prev;
        const newGrid = cloneGrid(prev.grid);
        const radius = brushSize - 1;
        for (let dr = -radius; dr <= radius; dr++) {
          for (let dc = -radius; dc <= radius; dc++) {
            const r = centerRow + dr;
            const c = centerCol + dc;
            if (r < 0 || r >= prev.rows || c < 0 || c >= prev.cols) continue;
            const state = newGrid[r][c].state;
            if (state === "start" || state === "end") continue;
            newGrid[r][c].state = mode === "wall" ? "wall" : "empty";
          }
        }
        return { ...prev, grid: newGrid };
      });
    },
    [brushSize]
  );

  const handleDrawEnd = useCallback(() => {
    setGridData((prev) => {
      if (!prev) return prev;
      setTrace(generateTrace(prev));
      reset();
      return prev;
    });
  }, [generateTrace, reset]);

  const handleNodeDrop = useCallback(
    (type: "start" | "end", row: number, col: number) => {
      setGridData((prev) => {
        if (!prev) return prev;
        const newGrid = cloneGrid(prev.grid);
        const oldPos = type === "start" ? prev.startPos : prev.endPos;
        newGrid[oldPos[0]][oldPos[1]].state = "empty";
        newGrid[row][col].state = type;
        const newStart = type === "start" ? [row, col] as [number, number] : prev.startPos;
        const newEnd = type === "end" ? [row, col] as [number, number] : prev.endPos;
        const updated = { ...prev, grid: newGrid, startPos: newStart, endPos: newEnd };
        setTrace(generateTrace(updated));
        reset();
        return updated;
      });
    },
    [generateTrace, reset]
  );

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
          {
            label: "Path found",
            value: pathFound ? "Yes" : trace ? "No" : "—",
            accent: pathFound ? "cyan" : trace ? "red" : undefined,
          },
          { label: "Step", value: `${step + 1} / ${totalSteps || 1}` },
        ].map(({ label, value, accent }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{label}</span>
            <span
              className={`text-sm font-mono ${
                accent === "cyan"
                  ? "text-[var(--color-accent)]"
                  : accent === "red"
                  ? "text-red-400"
                  : "text-[var(--color-text-primary)]"
              }`}
            >
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
          onNodeDrop={handleNodeDrop}
        />
      )}

      <div className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between flex-wrap gap-3">
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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Generate Maze hover dropdown */}
            <div
              ref={mazeMenuRef}
              className="relative"
              onMouseEnter={() => setMazeOpen(true)}
              onMouseLeave={() => setMazeOpen(false)}
            >
              <button
                className="px-3 py-1.5 rounded text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors font-mono flex items-center gap-1"
              >
                Generate Maze
                <span className="text-[var(--color-text-muted)] text-[10px]">▾</span>
              </button>
              {mazeOpen && (
                <div className="absolute bottom-full left-0 mb-1 z-10 w-44 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden shadow-lg">
                  {(["small", "medium", "large"] as GridPreset[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handleMaze(p)}
                      className={`w-full px-3 py-2 text-left text-xs font-mono transition-colors ${
                        preset === p
                          ? "text-[var(--color-accent)] bg-[var(--color-border)]"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)]"
                      }`}
                    >
                      {PRESET_LABELS[p]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors font-mono"
            >
              Clear
            </button>

            {/* Brush size */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-mono">Brush</span>
              <div className="flex rounded overflow-hidden border border-[var(--color-border)]">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setBrushSize(n)}
                    className={`w-6 h-6 text-xs font-mono transition-colors ${
                      brushSize === n
                        ? "bg-[var(--color-accent)] text-[#030712]"
                        : "bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <StepScrubber step={step} totalSteps={totalSteps} onScrub={scrubTo} />

        {isEditing && (
          <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
            Click or drag to draw walls · Drag S/E to reposition · Press play to run
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
