import type { SortTrace, SortFrame } from "@/types/algorithm";

export function heapSort(input: number[]): SortTrace {
  const arr = [...input];
  const n = arr.length;
  const frames: SortFrame[] = [];
  const sorted: number[] = [];
  let comparisons = 0;
  let writes = 0;

  function push(compared: number[], swapped: number[]) {
    frames.push({ array: [...arr], compared, swapped, sorted: [...sorted] });
  }

  function heapify(size: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      comparisons++;
      push([largest, left], []);
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < size) {
      comparisons++;
      push([largest, right], []);
      if (arr[right] > arr[largest]) largest = right;
    }
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      writes += 2;
      push([], [root, largest]);
      heapify(size, largest);
    }
  }

  push([], []);

  // build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    writes += 2;
    sorted.push(i);
    push([], [0, i]);
    heapify(i, 0);
  }

  sorted.push(0);
  const allSorted = Array.from({ length: n }, (_, i) => i);
  frames.push({ array: [...arr], compared: [], swapped: [], sorted: allSorted });

  return { frames, comparisons, writes };
}
