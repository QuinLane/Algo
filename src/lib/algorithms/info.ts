import type { AlgorithmInfoContent } from "./types";

// Entries added here with each algorithm info commit
const infoRegistry: Record<string, AlgorithmInfoContent> = {};

export function getAlgorithmInfo(id: string): AlgorithmInfoContent | undefined {
  return infoRegistry[id];
}
