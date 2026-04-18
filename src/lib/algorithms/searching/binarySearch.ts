import type { SearchTrace, SearchFrame } from "@/types/algorithm";

export function binarySearch(array: number[], target: number): SearchTrace {
  const sorted = [...array].sort((a, b) => a - b);
  const frames: SearchFrame[] = [];
  let comparisons = 0;
  let foundIndex = -1;

  let low = 0;
  let high = sorted.length - 1;

  frames.push({ array: sorted, target, current: -1, low, high, mid: Math.floor((low + high) / 2), found: false });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    frames.push({ array: sorted, target, current: mid, low, high, mid, found: false });

    if (sorted[mid] === target) {
      foundIndex = mid;
      frames.push({ array: sorted, target, current: mid, low, high, mid, found: true });
      break;
    } else if (sorted[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (foundIndex === -1) {
    frames.push({ array: sorted, target, current: -1, low, high, found: false });
  }

  return { frames, comparisons, found: foundIndex !== -1, foundIndex };
}
