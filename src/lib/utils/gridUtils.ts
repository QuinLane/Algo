import type { Cell, CellState } from "@/types/algorithm";

export interface GridData {
  grid: Cell[][];
  startPos: [number, number];
  endPos: [number, number];
  rows: number;
  cols: number;
}

export const GRID_PRESETS = {
  small: { rows: 15, cols: 21 },
  medium: { rows: 21, cols: 31 },
  large: { rows: 31, cols: 43 },
} as const;

export type GridPreset = keyof typeof GRID_PRESETS;

function makeCell(row: number, col: number, state: CellState = "empty"): Cell {
  return { row, col, state };
}

export function generateEmptyGrid(rows: number, cols: number): GridData {
  const grid: Cell[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => makeCell(r, c))
  );
  const startPos: [number, number] = [Math.floor(rows / 2), 1];
  const endPos: [number, number] = [Math.floor(rows / 2), cols - 2];
  grid[startPos[0]][startPos[1]].state = "start";
  grid[endPos[0]][endPos[1]].state = "end";
  return { grid, startPos, endPos, rows, cols };
}

// DFS recursive backtracking maze — requires odd dimensions for clean carving
export function generateMaze(rows: number, cols: number): GridData {
  const grid: Cell[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => makeCell(r, c, "wall"))
  );

  const visited = new Set<string>();

  const carve = (r: number, c: number) => {
    visited.add(`${r},${c}`);
    grid[r][c].state = "empty";

    for (const [dr, dc] of shuffle([[-2, 0], [2, 0], [0, -2], [0, 2]])) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 1 && nr < rows - 1 && nc >= 1 && nc < cols - 1 && !visited.has(`${nr},${nc}`)) {
        grid[r + dr / 2][c + dc / 2].state = "empty";
        carve(nr, nc);
      }
    }
  };

  carve(1, 1);

  const startPos: [number, number] = [1, 1];
  const endPos: [number, number] = [rows - 2, cols - 2];
  grid[startPos[0]][startPos[1]].state = "start";
  grid[endPos[0]][endPos[1]].state = "end";

  return { grid, startPos, endPos, rows, cols };
}

export function cloneGrid(grid: Cell[][]): Cell[][] {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

export function getPassableNeighbors(
  grid: Cell[][],
  row: number,
  col: number,
  rows: number,
  cols: number
): Array<[number, number]> {
  const result: Array<[number, number]> = [];
  for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].state !== "wall") {
      result.push([nr, nc]);
    }
  }
  return result;
}

export function manhattanDistance(a: [number, number], b: [number, number]): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
