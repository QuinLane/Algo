"use client";

import { useRef, useCallback, memo } from "react";
import type { Cell, CellState, PathfindingFrame } from "@/types/algorithm";
import type { GridData } from "@/lib/utils/gridUtils";

interface Props {
  gridData: GridData;
  frame: PathfindingFrame | null;
  isEditing: boolean;
  onCellDraw?: (row: number, col: number, mode: "wall" | "erase") => void;
  onDrawEnd?: () => void;
}

const CELL_COLORS: Record<CellState, string> = {
  empty: "var(--color-bg-card)",
  wall: "#1e293b",
  start: "var(--color-accent)",
  end: "#f97316",
  visited: "#0e4f6e",
  frontier: "#0891b2",
  path: "#fbbf24",
};

const CELL_STROKE = "var(--color-border)";

function cellColor(state: CellState): string {
  return CELL_COLORS[state] ?? CELL_COLORS.empty;
}

export default memo(function GridVisualizer({ gridData, frame, isEditing, onCellDraw, onDrawEnd }: Props) {
  const { rows, cols } = gridData;
  const svgRef = useRef<SVGSVGElement>(null);
  const drawingRef = useRef(false);
  const drawModeRef = useRef<"wall" | "erase">("wall");

  const displayGrid: Cell[][] = frame ? frame.grid : gridData.grid;

  const getCellFromPoint = useCallback(
    (clientX: number, clientY: number): [number, number] | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const col = Math.floor(((clientX - rect.left) / rect.width) * cols);
      const row = Math.floor(((clientY - rect.top) / rect.height) * rows);
      if (row < 0 || row >= rows || col < 0 || col >= cols) return null;
      return [row, col];
    },
    [rows, cols]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isEditing || !onCellDraw) return;
      e.preventDefault();
      const pos = getCellFromPoint(e.clientX, e.clientY);
      if (!pos) return;
      const [row, col] = pos;
      const state = gridData.grid[row][col].state;
      if (state === "start" || state === "end") return;
      const mode = state === "wall" ? "erase" : "wall";
      drawModeRef.current = mode;
      drawingRef.current = true;
      onCellDraw(row, col, mode);
    },
    [isEditing, onCellDraw, getCellFromPoint, gridData.grid]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!drawingRef.current || !isEditing || !onCellDraw) return;
      const pos = getCellFromPoint(e.clientX, e.clientY);
      if (!pos) return;
      const [row, col] = pos;
      const state = gridData.grid[row][col].state;
      if (state === "start" || state === "end") return;
      onCellDraw(row, col, drawModeRef.current);
    },
    [isEditing, onCellDraw, getCellFromPoint, gridData.grid]
  );

  const handleMouseUp = useCallback(() => {
    if (drawingRef.current) {
      drawingRef.current = false;
      onDrawEnd?.();
    }
  }, [onDrawEnd]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (!isEditing || !onCellDraw) return;
      e.preventDefault();
      const touch = e.touches[0];
      const pos = getCellFromPoint(touch.clientX, touch.clientY);
      if (!pos) return;
      const [row, col] = pos;
      const state = gridData.grid[row][col].state;
      if (state === "start" || state === "end") return;
      const mode = state === "wall" ? "erase" : "wall";
      drawModeRef.current = mode;
      drawingRef.current = true;
      onCellDraw(row, col, mode);
    },
    [isEditing, onCellDraw, getCellFromPoint, gridData.grid]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (!drawingRef.current || !isEditing || !onCellDraw) return;
      e.preventDefault();
      const touch = e.touches[0];
      const pos = getCellFromPoint(touch.clientX, touch.clientY);
      if (!pos) return;
      const [row, col] = pos;
      const state = gridData.grid[row][col].state;
      if (state === "start" || state === "end") return;
      onCellDraw(row, col, drawModeRef.current);
    },
    [isEditing, onCellDraw, getCellFromPoint, gridData.grid]
  );

  const GAP = 0.05;

  return (
    <div
      className="w-full rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
      style={{ aspectRatio: `${cols} / ${rows}` }}
      onMouseLeave={handleMouseUp}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${cols} ${rows}`}
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ cursor: isEditing ? "crosshair" : "default", display: "block" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {displayGrid.map((rowArr, r) =>
          rowArr.map((cell, c) => (
            <rect
              key={`${r}-${c}`}
              x={c + GAP}
              y={r + GAP}
              width={1 - GAP * 2}
              height={1 - GAP * 2}
              fill={cellColor(cell.state)}
              rx={0.08}
            />
          ))
        )}
        {/* Start marker */}
        <text
          x={gridData.startPos[1] + 0.5}
          y={gridData.startPos[0] + 0.72}
          fontSize={0.6}
          textAnchor="middle"
          fill="#030712"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          S
        </text>
        {/* End marker */}
        <text
          x={gridData.endPos[1] + 0.5}
          y={gridData.endPos[0] + 0.72}
          fontSize={0.6}
          textAnchor="middle"
          fill="#030712"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          E
        </text>
      </svg>
    </div>
  );
});
