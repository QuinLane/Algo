import type { SortTrace, SortFrame } from "@/types/algorithm";

export function selectionSort(input: number[]): SortTrace {
  const arr = [...input];
  const n = arr.length;
  const frames: SortFrame[] = [];
  const sorted: number[] = [];
  let comparisons = 0;
  let writes = 0;

  frames.push({ array: [...arr], compared: [], swapped: [], sorted: [] });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      frames.push({ array: [...arr], compared: [minIdx, j], swapped: [], sorted: [...sorted] });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      writes += 2;
      frames.push({ array: [...arr], compared: [], swapped: [i, minIdx], sorted: [...sorted] });
    }

    sorted.push(i);
    frames.push({ array: [...arr], compared: [], swapped: [], sorted: [...sorted] });
  }

  sorted.push(n - 1);
  const allSorted = Array.from({ length: n }, (_, i) => i);
  frames.push({ array: [...arr], compared: [], swapped: [], sorted: allSorted });

  return { frames, comparisons, writes };
}
