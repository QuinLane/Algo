import type { SearchTrace, SearchFrame } from "@/types/algorithm";

export function linearSearch(array: number[], target: number): SearchTrace {
  const sorted = [...array].sort((a, b) => a - b);
  const frames: SearchFrame[] = [];
  let comparisons = 0;
  let foundIndex = -1;

  frames.push({ array: sorted, target, current: -1, found: false });

  for (let i = 0; i < sorted.length; i++) {
    comparisons++;
    frames.push({ array: sorted, target, current: i, found: false });

    if (sorted[i] === target) {
      foundIndex = i;
      frames.push({ array: sorted, target, current: i, found: true });
      break;
    }
  }

  if (foundIndex === -1) {
    frames.push({ array: sorted, target, current: -1, found: false });
  }

  return { frames, comparisons, found: foundIndex !== -1, foundIndex };
}
