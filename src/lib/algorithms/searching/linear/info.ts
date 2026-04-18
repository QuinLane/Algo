import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Linear search is the most straightforward search algorithm: it examines each element in sequence from left to right until it either finds the target or exhausts the entire list. No preprocessing, sorting, or special data structure is required — it works on any collection, ordered or not.

Despite being the slowest search algorithm asymptotically, linear search is often the right choice in practice. For small collections or unsorted data, the simplicity and low constant factors of linear search outperform more complex alternatives. It is also the only viable option when you cannot sort the data or know nothing about its distribution.`,

    howItWorks: [
      "Start at the first element (index 0).",
      "Compare the current element to the target value.",
      "If they match, return the current index — the target has been found.",
      "If not, advance to the next element.",
      "Repeat until the target is found or the end of the array is reached.",
      "If the end is reached without a match, report that the target is not present.",
    ],

    useCases: [
      "Searching unsorted arrays where sorting first would be too costly.",
      "Very small datasets where the overhead of binary search setup isn't justified.",
      "Linked lists and other sequential-access data structures where random access is unavailable.",
      "Finding all occurrences of a value (not just the first), since a full scan is required anyway.",
    ],

    complexity: {
      time: {
        best: {
          value: "O(1)",
          note: "Target is the first element — found immediately.",
        },
        average: {
          value: "O(n)",
          note: "Target is somewhere in the middle — roughly n/2 comparisons on average.",
        },
        worst: {
          value: "O(n)",
          note: "Target is the last element or not present — all n elements must be checked.",
        },
      },
      space: {
        value: "O(1)",
        note: "Only a loop index is needed; no extra memory proportional to input size.",
      },
    },
  },

  code: {
    javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,

    python: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1`,

    java: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,

    cpp: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
  },
};
