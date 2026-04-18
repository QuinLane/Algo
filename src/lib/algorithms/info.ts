import type { AlgorithmInfoContent } from "./types";
import { info as bubbleSortInfo } from "./sorting/bubble/info";
import { info as insertionSortInfo } from "./sorting/insertion/info";
import { info as selectionSortInfo } from "./sorting/selection/info";
import { info as mergeSortInfo } from "./sorting/merge/info";
import { info as quickSortInfo } from "./sorting/quick/info";
import { info as heapSortInfo } from "./sorting/heap/info";

// Entries added here with each algorithm info commit
const infoRegistry: Record<string, AlgorithmInfoContent> = {
  "bubble-sort": bubbleSortInfo,
  "insertion-sort": insertionSortInfo,
  "selection-sort": selectionSortInfo,
  "merge-sort": mergeSortInfo,
  "quick-sort": quickSortInfo,
  "heap-sort": heapSortInfo,
};

export function getAlgorithmInfo(id: string): AlgorithmInfoContent | undefined {
  return infoRegistry[id];
}
