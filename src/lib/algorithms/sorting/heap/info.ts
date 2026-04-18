import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Heap sort combines the best properties of selection sort and a binary heap data structure. It first transforms the array into a max-heap — a complete binary tree where every parent is greater than its children — and then repeatedly extracts the maximum element from the heap, placing it at the end of the sorted region.

Heap sort achieves O(n log n) in all cases, including the worst case, while sorting entirely in-place with O(1) extra space. The trade-off compared to quicksort is poorer cache performance: heap operations jump between distant array indices (parent-child relationships) rather than accessing memory sequentially. In practice, quicksort is usually faster due to this cache advantage, but heap sort is preferred when a guaranteed worst-case bound is required without extra memory.`,

    howItWorks: [
      "Build a max-heap from the array by calling 'heapify' on every non-leaf node from bottom to top.",
      "After heap construction, the largest element is at index 0 (the root).",
      "Swap the root (maximum) with the last element of the unsorted region.",
      "Shrink the heap boundary by one — the swapped element is now in its final sorted position.",
      "Restore the max-heap property by 'sifting down' the new root into its correct position.",
      "Repeat steps 3–5 until the heap has one element remaining.",
    ],

    useCases: [
      "Systems requiring guaranteed O(n log n) worst-case performance without extra memory.",
      "Real-time or safety-critical applications where unpredictable O(n²) cases (like quicksort's) are unacceptable.",
      "Implementing priority queues — the underlying heap structure is directly usable.",
      "Sorting when both time and space budgets are tight (in-place with O(n log n) is a rare combination).",
    ],

    complexity: {
      time: {
        best: {
          value: "O(n log n)",
          note: "Heap construction is O(n); each of the n extractions takes O(log n).",
        },
        average: {
          value: "O(n log n)",
          note: "Consistent regardless of input distribution.",
        },
        worst: {
          value: "O(n log n)",
          note: "Guaranteed — no degenerate case like quicksort's O(n²) worst case.",
        },
      },
      space: {
        value: "O(1)",
        note: "Fully in-place — the heap is built within the original array.",
      },
    },
  },

  code: {
    javascript: `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,

    python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest = i
    left, right = 2 * i + 1, 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,

    java: `public static void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
        heapify(arr, i, 0);
    }
}

private static void heapify(int[] arr, int n, int i) {
    int largest = i, left = 2 * i + 1, right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest != i) {
        int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
        heapify(arr, n, largest);
    }
}`,

    cpp: `void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

void heapify(vector<int>& arr, int n, int i) {
    int largest = i, left = 2 * i + 1, right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}`,
  },
};
