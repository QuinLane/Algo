import type { AlgorithmInfoContent } from "./types";
import { info as bubbleSortInfo } from "./sorting/bubble/info";
import { info as insertionSortInfo } from "./sorting/insertion/info";
import { info as selectionSortInfo } from "./sorting/selection/info";

// Entries added here with each algorithm info commit
const infoRegistry: Record<string, AlgorithmInfoContent> = {
  "bubble-sort": bubbleSortInfo,
  "insertion-sort": insertionSortInfo,
  "selection-sort": selectionSortInfo,
};

export function getAlgorithmInfo(id: string): AlgorithmInfoContent | undefined {
  return infoRegistry[id];
}
