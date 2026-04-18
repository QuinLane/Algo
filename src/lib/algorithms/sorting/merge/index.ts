import type { SortTrace, SortFrame } from "@/types/algorithm";

export function mergeSort(input: number[]): SortTrace {
  const arr = [...input];
  const n = arr.length;
  const frames: SortFrame[] = [];
  const sorted: number[] = [];
  let comparisons = 0;
  let writes = 0;

  function pushFrame(
    main: number[],
    aux: number[],
    compared: number[],
    swapped: number[],
    sortedIndices: number[]
  ) {
    frames.push({
      array: [...main],
      auxiliary: [...aux],
      compared,
      swapped,
      sorted: [...sortedIndices],
    });
  }

  const aux = new Array(n).fill(0);

  function merge(lo: number, mid: number, hi: number) {
    for (let k = lo; k <= hi; k++) aux[k] = arr[k];

    let i = lo;
    let j = mid + 1;
    for (let k = lo; k <= hi; k++) {
      if (i > mid) {
        arr[k] = aux[j++];
        writes++;
        pushFrame(arr, aux, [k], [k], sorted);
      } else if (j > hi) {
        arr[k] = aux[i++];
        writes++;
        pushFrame(arr, aux, [k], [k], sorted);
      } else {
        comparisons++;
        pushFrame(arr, aux, [i, j], [], sorted);
        if (aux[i] <= aux[j]) {
          arr[k] = aux[i++];
        } else {
          arr[k] = aux[j++];
        }
        writes++;
        pushFrame(arr, aux, [], [k], sorted);
      }
    }
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);

    // mark merged region as sorted if it covers lo..hi fully
    if (lo === 0 && hi === n - 1) {
      for (let k = 0; k < n; k++) sorted.push(k);
      pushFrame(arr, aux, [], [], sorted);
    }
  }

  pushFrame(arr, aux, [], [], []);
  sort(0, n - 1);

  return { frames, comparisons, writes };
}
