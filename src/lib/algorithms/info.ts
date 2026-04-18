import type { AlgorithmInfoContent } from "./types";
import { info as bubbleSortInfo } from "./sorting/bubble/info";

// Entries added here with each algorithm info commit
const infoRegistry: Record<string, AlgorithmInfoContent> = {
  "bubble-sort": bubbleSortInfo,
};

export function getAlgorithmInfo(id: string): AlgorithmInfoContent | undefined {
  return infoRegistry[id];
}
