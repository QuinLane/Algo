import type { SortTrace, SortFrame } from "@/types/algorithm";

export function bubbleSort(input: number[]): SortTrace {
  const arr = [...input];
  const n = arr.length;
  const frames: SortFrame[] = [];
  const sorted: number[] = [];
  let comparisons = 0;
  let writes = 0;

  frames.push({ array: [...arr], compared: [], swapped: [], sorted: [] });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++;
      frames.push({ array: [...arr], compared: [j, j + 1], swapped: [], sorted: [...sorted] });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        writes += 2;
        swapped = true;
        frames.push({ array: [...arr], compared: [], swapped: [j, j + 1], sorted: [...sorted] });
      }
    }
    sorted.unshift(n - 1 - i);
    frames.push({ array: [...arr], compared: [], swapped: [], sorted: [...sorted] });
    if (!swapped) break;
  }

  // mark all as sorted on completion
  const allSorted = Array.from({ length: n }, (_, i) => i);
  frames.push({ array: [...arr], compared: [], swapped: [], sorted: allSorted });

  return { frames, comparisons, writes };
}
