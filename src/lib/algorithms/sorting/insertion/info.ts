import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Insertion sort builds the final sorted array one element at a time. It works the way most people intuitively sort a hand of playing cards: take one card, scan left through the already-sorted portion, and slide it into the correct position. Elements to its right shift one place to make room.

This incremental approach gives insertion sort an excellent best-case of O(n) on already-sorted or nearly-sorted data, and it performs particularly well on small datasets. Its in-place, stable nature and simple implementation make it the preferred choice in many hybrid algorithms (such as Timsort) for runs shorter than roughly 32–64 elements.`,

    howItWorks: [
      "Treat the first element as a sorted subarray of length one.",
      "Pick the next element (the 'key') from the unsorted portion.",
      "Compare the key against each element in the sorted portion, moving right to left.",
      "Shift each sorted element one position to the right while it is greater than the key.",
      "Insert the key into the gap left by the shifting.",
      "Repeat from step 2 until all elements are in the sorted subarray.",
    ],

    useCases: [
      "Small arrays (typically fewer than 20–64 elements) where overhead of complex algorithms isn't worth it.",
      "Nearly-sorted data — only a few elements are out of place.",
      "Online sorting — new elements can be inserted into a sorted sequence one at a time.",
      "As the base case inside hybrid algorithms like Timsort and Introsort.",
    ],

    complexity: {
      time: {
        best: {
          value: "O(n)",
          note: "Already sorted — each element requires just one comparison to confirm position.",
        },
        average: {
          value: "O(n²)",
          note: "Random input requires roughly n²/4 comparisons and shifts on average.",
        },
        worst: {
          value: "O(n²)",
          note: "Reverse-sorted input — every element must shift past all previously sorted elements.",
        },
      },
      space: {
        value: "O(1)",
        note: "Sorts in-place; only a single 'key' variable is needed beyond the array.",
      },
    },
  },

  code: {
    javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,

    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,

    java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,

    cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
  },
};
