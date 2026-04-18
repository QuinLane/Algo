import type { SortTrace, SortFrame } from "@/types/algorithm";

export function insertionSort(input: number[]): SortTrace {
  const arr = [...input];
  const n = arr.length;
  const frames: SortFrame[] = [];
  const sorted: number[] = [0];
  let comparisons = 0;
  let writes = 0;

  frames.push({ array: [...arr], compared: [], swapped: [], sorted: [0] });

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      comparisons++;
      frames.push({ array: [...arr], compared: [j - 1, j], swapped: [], sorted: [...sorted] });

      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        writes += 2;
        frames.push({ array: [...arr], compared: [], swapped: [j - 1, j], sorted: [...sorted] });
        j--;
      } else {
        break;
      }
    }
    sorted.push(i);
    frames.push({ array: [...arr], compared: [], swapped: [], sorted: [...sorted] });
  }

  const allSorted = Array.from({ length: n }, (_, i) => i);
  frames.push({ array: [...arr], compared: [], swapped: [], sorted: allSorted });

  return { frames, comparisons, writes };
}
