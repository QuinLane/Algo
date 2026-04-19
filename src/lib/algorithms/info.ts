import type { AlgorithmInfoContent } from "./types";
import { info as bubbleSortInfo } from "./sorting/bubble/info";
import { info as insertionSortInfo } from "./sorting/insertion/info";
import { info as selectionSortInfo } from "./sorting/selection/info";
import { info as mergeSortInfo } from "./sorting/merge/info";
import { info as quickSortInfo } from "./sorting/quick/info";
import { info as heapSortInfo } from "./sorting/heap/info";
import { info as linearSearchInfo } from "./searching/linear/info";
import { info as binarySearchInfo } from "./searching/binary/info";
import { info as bfsInfo } from "./graph/bfs/info";
import { info as dfsInfo } from "./graph/dfs/info";
import { info as dijkstraInfo } from "./graph/dijkstra/info";
import { info as astarInfo } from "./pathfinding/astar/info";
import { info as dijkstraGridInfo } from "./pathfinding/dijkstra-grid/info";
import { info as bstInfo } from "./trees/bst/info";

// Entries added here with each algorithm info commit
const infoRegistry: Record<string, AlgorithmInfoContent> = {
  "bubble-sort": bubbleSortInfo,
  "insertion-sort": insertionSortInfo,
  "selection-sort": selectionSortInfo,
  "merge-sort": mergeSortInfo,
  "quick-sort": quickSortInfo,
  "heap-sort": heapSortInfo,
  "linear-search": linearSearchInfo,
  "binary-search": binarySearchInfo,
  bfs: bfsInfo,
  dfs: dfsInfo,
  dijkstra: dijkstraInfo,
  astar: astarInfo,
  "dijkstra-grid": dijkstraGridInfo,
  bst: bstInfo,
};

export function getAlgorithmInfo(id: string): AlgorithmInfoContent | undefined {
  return infoRegistry[id];
}
