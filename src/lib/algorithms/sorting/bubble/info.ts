import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Bubble sort is one of the simplest sorting algorithms, making it an ideal starting point for understanding how sorting works. It operates by repeatedly scanning the array and comparing each pair of adjacent elements, swapping them if they are in the wrong order. With each full pass, the largest unsorted element "bubbles up" to its correct position at the end.

Despite its simplicity, bubble sort is rarely used in practice due to its O(n²) average and worst-case time complexity. However, it has a notable best case of O(n) — achieved through an early-exit optimization — when the input is already or nearly sorted, where a single pass confirms order without performing any swaps.`,

    howItWorks: [
      "Start at the beginning of the array and compare the first two adjacent elements.",
      "If the left element is greater than the right, swap them.",
      "Move one position to the right and repeat the comparison.",
      "After one full pass, the largest element is guaranteed to be in its final sorted position at the end.",
      "Repeat from the beginning for the remaining unsorted portion (shrinks by one each pass).",
      "If a full pass completes without any swaps, the array is already sorted — exit early.",
    ],

    useCases: [
      "Teaching sorting fundamentals — its logic is easy to trace step by step.",
      "Nearly-sorted arrays, where the early-exit optimization makes performance approach O(n).",
      "Tiny datasets where simplicity outweighs the cost of O(n²) comparisons.",
      "Environments with extremely limited memory, since it sorts in-place with O(1) space.",
    ],

    complexity: {
      time: {
        best: {
          value: "O(n)",
          note: "Already sorted — one pass detects no swaps and exits early.",
        },
        average: {
          value: "O(n²)",
          note: "Random input requires roughly n²/2 comparisons and swaps.",
        },
        worst: {
          value: "O(n²)",
          note: "Reverse-sorted input — every comparison results in a swap.",
        },
      },
      space: {
        value: "O(1)",
        note: "Sorts in-place using only a constant number of extra variables.",
      },
    },
  },

  code: {
    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,

    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,

    java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,

    cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  },
};
