import type { PathfindingTrace, PathfindingFrame, Cell } from "@/types/algorithm";
import type { GridData } from "@/lib/utils/gridUtils";
import { cloneGrid, getPassableNeighbors, manhattanDistance } from "@/lib/utils/gridUtils";

type Coord = [number, number];

interface AStarNode {
  pos: Coord;
  g: number;
  h: number;
  f: number;
}

function coordKey([r, c]: Coord): string {
  return `${r},${c}`;
}

function snap(
  cells: Cell[][],
  open: Coord[],
  closed: Set<string>,
  current?: Coord,
  path?: Coord[]
): PathfindingFrame {
  return {
    grid: cloneGrid(cells),
    open: [...open],
    closed: [...closed].map((k) => k.split(",").map(Number) as Coord),
    current,
    path,
  };
}

export function aStar(data: GridData): PathfindingTrace {
  const { rows, cols, startPos, endPos } = data;
  const cells = cloneGrid(data.grid);
  const frames: PathfindingFrame[] = [];

  cells[startPos[0]][startPos[1]].state = "start";
  cells[endPos[0]][endPos[1]].state = "end";

  const openMap = new Map<string, AStarNode>();
  const closedSet = new Set<string>();
  const parentMap = new Map<string, Coord>();

  const startNode: AStarNode = {
    pos: startPos,
    g: 0,
    h: manhattanDistance(startPos, endPos),
    f: manhattanDistance(startPos, endPos),
  };
  openMap.set(coordKey(startPos), startNode);

  frames.push(snap(cells, [startPos], closedSet));

  let nodesExplored = 0;

  while (openMap.size > 0) {
    // Pick lowest f (tie-break on h)
    let current: AStarNode | null = null;
    for (const node of openMap.values()) {
      if (!current || node.f < current.f || (node.f === current.f && node.h < current.h)) {
        current = node;
      }
    }
    if (!current) break;

    const curKey = coordKey(current.pos);
    openMap.delete(curKey);
    closedSet.add(curKey);
    nodesExplored++;

    const [row, col] = current.pos;
    const isStart = row === startPos[0] && col === startPos[1];
    const isEnd = row === endPos[0] && col === endPos[1];

    if (!isStart && !isEnd) cells[row][col].state = "visited";

    const openCoords = [...openMap.values()].map((n) => n.pos);
    frames.push(snap(cells, openCoords, closedSet, current.pos));

    if (isEnd) {
      // Reconstruct path
      const path: Coord[] = [];
      let pos: Coord | undefined = current.pos;
      while (pos) {
        path.unshift(pos);
        const [pr, pc] = pos;
        const isS = pr === startPos[0] && pc === startPos[1];
        const isE = pr === endPos[0] && pc === endPos[1];
        if (!isS && !isE) cells[pr][pc].state = "path";
        pos = parentMap.get(coordKey(pos));
      }
      frames.push(snap(cells, openCoords, closedSet, current.pos, path));
      return { frames, nodesExplored, pathLength: path.length - 1, pathFound: true };
    }

    for (const [nr, nc] of getPassableNeighbors(cells, row, col, rows, cols)) {
      const nKey = coordKey([nr, nc]);
      if (closedSet.has(nKey)) continue;

      const g = current.g + 1;
      const h = manhattanDistance([nr, nc], endPos);
      const f = g + h;

      const existing = openMap.get(nKey);
      if (!existing || g < existing.g) {
        openMap.set(nKey, { pos: [nr, nc], g, h, f });
        parentMap.set(nKey, current.pos);
        const isE = nr === endPos[0] && nc === endPos[1];
        const isS = nr === startPos[0] && nc === startPos[1];
        if (!isS && !isE) cells[nr][nc].state = "frontier";
      }
    }
  }

  frames.push(snap(cells, [], closedSet));
  return { frames, nodesExplored, pathLength: 0, pathFound: false };
}
