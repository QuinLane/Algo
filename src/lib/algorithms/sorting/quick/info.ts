import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Quick sort is a divide-and-conquer algorithm renowned for its practical speed on real-world data. It works by selecting a 'pivot' element and rearranging the array so that all elements less than the pivot appear to its left and all greater elements appear to its right — a step called partitioning. The algorithm then recursively sorts the two partitions independently.

Quick sort's average case of O(n log n) typically outperforms merge sort in practice due to better cache locality and in-place sorting (no auxiliary arrays). However, its worst case is O(n²), which occurs when the pivot consistently lands at an extreme (e.g., always picking the smallest or largest element). This is mitigated in practice by using strategies like median-of-three pivot selection or random pivot choice.`,

    howItWorks: [
      "Choose a pivot element (commonly the last element, the first, or a random one).",
      "Partition the array: move all elements less than the pivot to its left and all greater elements to its right.",
      "After partitioning, the pivot is in its final sorted position.",
      "Recursively apply quick sort to the left subarray (elements < pivot).",
      "Recursively apply quick sort to the right subarray (elements > pivot).",
      "Base case: subarrays of zero or one element are already sorted.",
    ],

    useCases: [
      "General-purpose in-memory sorting where average-case performance matters most.",
      "Systems that benefit from cache efficiency — quick sort accesses memory sequentially during partitioning.",
      "When O(1) extra space is preferred over merge sort's O(n) auxiliary arrays.",
      "Foundation of many standard library sort implementations (e.g., C's qsort, Java's dual-pivot quicksort for primitives).",
    ],

    complexity: {
      time: {
        best: {
          value: "O(n log n)",
          note: "Pivot always splits the array into equal halves — log n levels of recursion.",
        },
        average: {
          value: "O(n log n)",
          note: "Expected with random or median-of-three pivot selection.",
        },
        worst: {
          value: "O(n²)",
          note: "Pivot is always the min or max — one partition has n−1 elements, creating a skewed tree.",
        },
      },
      space: {
        value: "O(log n)",
        note: "In-place partitioning, but the call stack grows with recursion depth (O(log n) average).",
      },
    },
  },

  code: {
    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,

    python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,

    java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pivotIdx = partition(arr, low, high);
        quickSort(arr, low, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
    return i + 1;
}`,

    cpp: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivotIdx = partition(arr, low, high);
        quickSort(arr, low, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, high);
    }
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) swap(arr[++i], arr[j]);
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
  },
};
