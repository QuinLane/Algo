import type { PathfindingTrace, PathfindingFrame, Cell } from "@/types/algorithm";
import type { GridData } from "@/lib/utils/gridUtils";
import { cloneGrid, getPassableNeighbors } from "@/lib/utils/gridUtils";

type Coord = [number, number];

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

export function dijkstraGrid(data: GridData): PathfindingTrace {
  const { rows, cols, startPos, endPos } = data;
  const cells = cloneGrid(data.grid);
  const frames: PathfindingFrame[] = [];

  cells[startPos[0]][startPos[1]].state = "start";
  cells[endPos[0]][endPos[1]].state = "end";

  // dist map keyed by coordKey
  const dist = new Map<string, number>();
  const parentMap = new Map<string, Coord>();
  const visited = new Set<string>();

  // Simple min-priority queue as sorted array
  type QueueEntry = { pos: Coord; d: number };
  const queue: QueueEntry[] = [];
  const enqueue = (pos: Coord, d: number) => {
    queue.push({ pos, d });
    queue.sort((a, b) => a.d - b.d);
  };

  dist.set(coordKey(startPos), 0);
  enqueue(startPos, 0);

  frames.push(snap(cells, [startPos], visited));

  let nodesExplored = 0;

  while (queue.length > 0) {
    const { pos: current, d } = queue.shift()!;
    const curKey = coordKey(current);

    if (visited.has(curKey)) continue;
    visited.add(curKey);
    nodesExplored++;

    const [row, col] = current;
    const isStart = row === startPos[0] && col === startPos[1];
    const isEnd = row === endPos[0] && col === endPos[1];

    if (!isStart && !isEnd) cells[row][col].state = "visited";

    const openCoords = queue.map((e) => e.pos);
    frames.push(snap(cells, openCoords, visited, current));

    if (isEnd) {
      const path: Coord[] = [];
      let pos: Coord | undefined = current;
      while (pos) {
        path.unshift(pos);
        const [pr, pc] = pos;
        const isS = pr === startPos[0] && pc === startPos[1];
        const isE = pr === endPos[0] && pc === endPos[1];
        if (!isS && !isE) cells[pr][pc].state = "path";
        pos = parentMap.get(coordKey(pos));
      }
      frames.push(snap(cells, openCoords, visited, current, path));
      return { frames, nodesExplored, pathLength: path.length - 1, pathFound: true };
    }

    for (const [nr, nc] of getPassableNeighbors(cells, row, col, rows, cols)) {
      const nKey = coordKey([nr, nc]);
      if (visited.has(nKey)) continue;

      const newDist = d + 1;
      if (newDist < (dist.get(nKey) ?? Infinity)) {
        dist.set(nKey, newDist);
        parentMap.set(nKey, current);
        enqueue([nr, nc], newDist);
        const isE = nr === endPos[0] && nc === endPos[1];
        const isS = nr === startPos[0] && nc === startPos[1];
        if (!isS && !isE) cells[nr][nc].state = "frontier";
      }
    }
  }

  frames.push(snap(cells, [], visited));
  return { frames, nodesExplored, pathLength: 0, pathFound: false };
}
