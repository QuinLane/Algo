"use client";

import { useRef, useCallback, useState, memo } from "react";
import type { Cell, CellState, PathfindingFrame } from "@/types/algorithm";
import type { GridData } from "@/lib/utils/gridUtils";

interface Props {
  gridData: GridData;
  frame: PathfindingFrame | null;
  isEditing: boolean;
  onCellDraw?: (row: number, col: number, mode: "wall" | "erase") => void;
  onDrawEnd?: () => void;
  onNodeDrop?: (type: "start" | "end", row: number, col: number) => void;
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

function cellColor(state: CellState): string {
  return CELL_COLORS[state] ?? CELL_COLORS.empty;
}

type InteractionMode = "draw" | "drag" | null;

const GAP = 0.05;

export default memo(function GridVisualizer({
  gridData,
  frame,
  isEditing,
  onCellDraw,
  onDrawEnd,
  onNodeDrop,
}: Props) {
  const { rows, cols } = gridData;
  const svgRef = useRef<SVGSVGElement>(null);
  const modeRef = useRef<InteractionMode>(null);
  const drawModeRef = useRef<"wall" | "erase">("wall");
  const dragTypeRef = useRef<"start" | "end" | null>(null);
  const [dragGhost, setDragGhost] = useState<[number, number] | null>(null);

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

  const setCursor = useCallback((svg: SVGSVGElement, cursor: string) => {
    svg.style.cursor = cursor;
  }, []);

  const endInteraction = useCallback(
    (clientX?: number, clientY?: number) => {
      if (modeRef.current === "draw") {
        modeRef.current = null;
        onDrawEnd?.();
      } else if (modeRef.current === "drag") {
        modeRef.current = null;
        setDragGhost(null);
        if (clientX !== undefined && clientY !== undefined) {
          const pos = getCellFromPoint(clientX, clientY);
          if (pos && dragTypeRef.current && onNodeDrop) {
            const [row, col] = pos;
            const state = gridData.grid[row][col].state;
            // Don't drop on a wall or the other endpoint
            const otherType = dragTypeRef.current === "start" ? "end" : "start";
            const otherState = otherType;
            if (state !== "wall" && state !== otherState) {
              onNodeDrop(dragTypeRef.current, row, col);
            }
          }
        }
        dragTypeRef.current = null;
        if (svgRef.current) setCursor(svgRef.current, isEditing ? "crosshair" : "default");
      }
    },
    [onDrawEnd, onNodeDrop, getCellFromPoint, gridData.grid, isEditing, setCursor]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isEditing) return;
      e.preventDefault();
      const pos = getCellFromPoint(e.clientX, e.clientY);
      if (!pos) return;
      const [row, col] = pos;
      const state = gridData.grid[row][col].state;

      if (state === "start" || state === "end") {
        modeRef.current = "drag";
        dragTypeRef.current = state;
        setDragGhost([row, col]);
        setCursor(e.currentTarget, "grabbing");
        return;
      }

      if (!onCellDraw) return;
      const mode = state === "wall" ? "erase" : "wall";
      drawModeRef.current = mode;
      modeRef.current = "draw";
      onCellDraw(row, col, mode);
    },
    [isEditing, onCellDraw, getCellFromPoint, gridData.grid, setCursor]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isEditing) return;
      const pos = getCellFromPoint(e.clientX, e.clientY);

      if (modeRef.current === "drag") {
        if (pos) setDragGhost(pos);
        return;
      }

      if (modeRef.current === "draw") {
        if (!pos || !onCellDraw) return;
        const [row, col] = pos;
        const state = gridData.grid[row][col].state;
        if (state !== "start" && state !== "end") {
          onCellDraw(row, col, drawModeRef.current);
        }
        return;
      }

      // Idle hover — update cursor to indicate draggable S/E cells
      if (pos) {
        const [r, c] = pos;
        const state = gridData.grid[r][c].state;
        setCursor(e.currentTarget, state === "start" || state === "end" ? "grab" : "crosshair");
      }
    },
    [isEditing, onCellDraw, getCellFromPoint, gridData.grid, setCursor]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      endInteraction(e.clientX, e.clientY);
    },
    [endInteraction]
  );

  const handleMouseLeave = useCallback(() => {
    endInteraction();
  }, [endInteraction]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (!isEditing || !onCellDraw) return;
      e.preventDefault();
      const touch = e.touches[0];
      const pos = getCellFromPoint(touch.clientX, touch.clientY);
      if (!pos) return;
      const [row, col] = pos;
      const state = gridData.grid[row][col].state;
      if (state === "start" || state === "end") {
        modeRef.current = "drag";
        dragTypeRef.current = state;
        setDragGhost([row, col]);
        return;
      }
      const mode = state === "wall" ? "erase" : "wall";
      drawModeRef.current = mode;
      modeRef.current = "draw";
      onCellDraw(row, col, mode);
    },
    [isEditing, onCellDraw, getCellFromPoint, gridData.grid]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (!isEditing) return;
      e.preventDefault();
      const touch = e.touches[0];
      const pos = getCellFromPoint(touch.clientX, touch.clientY);
      if (!pos) return;
      const [row, col] = pos;

      if (modeRef.current === "drag") {
        setDragGhost([row, col]);
        return;
      }

      if (modeRef.current === "draw" && onCellDraw) {
        const state = gridData.grid[row][col].state;
        if (state !== "start" && state !== "end") {
          onCellDraw(row, col, drawModeRef.current);
        }
      }
    },
    [isEditing, onCellDraw, getCellFromPoint, gridData.grid]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      const touch = e.changedTouches[0];
      if (touch) endInteraction(touch.clientX, touch.clientY);
      else endInteraction();
    },
    [endInteraction]
  );

  const dragType = dragTypeRef.current;

  return (
    <div
      className="w-full rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
      style={{ aspectRatio: `${cols} / ${rows}` }}
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
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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

        {/* S/E labels — follow drag ghost when dragging */}
        {(["start", "end"] as const).map((type) => {
          const isBeingDragged = dragGhost !== null && dragType === type;
          const pos = isBeingDragged ? dragGhost : type === "start" ? gridData.startPos : gridData.endPos;
          const [r, c] = pos;
          return (
            <g key={type} style={{ pointerEvents: "none" }}>
              {isBeingDragged && (
                <rect
                  x={c + GAP}
                  y={r + GAP}
                  width={1 - GAP * 2}
                  height={1 - GAP * 2}
                  fill={type === "start" ? "var(--color-accent)" : "#f97316"}
                  opacity={0.6}
                  rx={0.08}
                />
              )}
              <text
                x={c + 0.5}
                y={r + 0.72}
                fontSize={0.6}
                textAnchor="middle"
                fill="#030712"
                style={{ userSelect: "none" }}
              >
                {type === "start" ? "S" : "E"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});
