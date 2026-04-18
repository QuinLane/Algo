import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Selection sort divides the array into a growing sorted region on the left and a shrinking unsorted region on the right. On each pass it scans the entire unsorted region to find the minimum element, then swaps it into the next position of the sorted region. The sorted boundary advances by one after every pass.

Unlike bubble sort, selection sort performs at most n−1 swaps regardless of input order, making it attractive when write operations are expensive. However, it always runs in O(n²) time — even on already-sorted data — because it must scan the full unsorted region on every pass to guarantee it has found the minimum.`,

    howItWorks: [
      "Set the boundary between the sorted and unsorted regions at index 0.",
      "Scan the entire unsorted region to find the index of the minimum element.",
      "Swap the minimum element with the first element of the unsorted region.",
      "Advance the sorted boundary one position to the right.",
      "Repeat until the sorted region spans the entire array.",
    ],

    useCases: [
      "Memory-constrained environments where minimizing the number of writes is critical.",
      "Small arrays where its simplicity and low swap count are practical advantages.",
      "Situations where the cost of a swap far exceeds the cost of a comparison.",
      "Educational settings — its invariant (min of unsorted always moves left) is easy to verify visually.",
    ],

    complexity: {
      time: {
        best: {
          value: "O(n²)",
          note: "No early exit — always scans the full unsorted region even if already sorted.",
        },
        average: {
          value: "O(n²)",
          note: "Exactly n(n−1)/2 comparisons regardless of input distribution.",
        },
        worst: {
          value: "O(n²)",
          note: "Same as best and average — the scan is unconditional.",
        },
      },
      space: {
        value: "O(1)",
        note: "In-place — only a couple of index variables and a temporary swap value.",
      },
    },
  },

  code: {
    javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,

    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,

    java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`,

    cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) swap(arr[i], arr[minIdx]);
    }
}`,
  },
};
