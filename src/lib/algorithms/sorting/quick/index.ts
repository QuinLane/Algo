import type { SortTrace, SortFrame } from "@/types/algorithm";

export function quickSort(input: number[]): SortTrace {
  const arr = [...input];
  const n = arr.length;
  const frames: SortFrame[] = [];
  const sorted: number[] = [];
  let comparisons = 0;
  let writes = 0;

  function push(compared: number[], swapped: number[], pivot?: number) {
    const f: SortFrame = { array: [...arr], compared, swapped, sorted: [...sorted] };
    if (pivot !== undefined) f.pivot = pivot;
    frames.push(f);
  }

  function partition(lo: number, hi: number): number {
    const pivotVal = arr[hi];
    push([], [], hi);
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      push([j, hi], [], hi);
      if (arr[j] <= pivotVal) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          writes += 2;
          push([], [i, j], hi);
        }
      }
    }
    const pivotIdx = i + 1;
    if (pivotIdx !== hi) {
      [arr[pivotIdx], arr[hi]] = [arr[hi], arr[pivotIdx]];
      writes += 2;
      push([], [pivotIdx, hi], pivotIdx);
    }
    sorted.push(pivotIdx);
    push([], [], pivotIdx);
    return pivotIdx;
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) {
      if (lo === hi) sorted.push(lo);
      return;
    }
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  }

  push([], []);
  sort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, i) => i);
  frames.push({ array: [...arr], compared: [], swapped: [], sorted: allSorted });

  return { frames, comparisons, writes };
}
