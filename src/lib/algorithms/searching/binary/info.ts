import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Binary search is an exceptionally efficient algorithm for finding a target value in a sorted array. Rather than checking every element, it exploits the sorted order to eliminate half the remaining search space with each comparison. It computes the midpoint of the current range, compares the middle element to the target, and narrows the search to either the left or right half depending on the result.

This halving strategy produces O(log n) time complexity — searching one billion sorted elements requires at most 30 comparisons. The critical precondition is that the array must be sorted; binary search on unsorted data produces incorrect results. When sorting plus searching is required, this O(n log n) + O(log n) combined cost is often still far better than repeated linear searches.`,

    howItWorks: [
      "Set the search range: left = 0, right = array length − 1.",
      "Compute the midpoint: mid = floor((left + right) / 2).",
      "Compare the element at mid to the target.",
      "If arr[mid] equals the target, return mid — the target is found.",
      "If arr[mid] is less than the target, the target must be in the right half — set left = mid + 1.",
      "If arr[mid] is greater than the target, the target must be in the left half — set right = mid − 1.",
      "Repeat from step 2. If left > right, the target is not in the array.",
    ],

    useCases: [
      "Searching large sorted arrays or databases where O(n) linear scan would be too slow.",
      "Finding insertion points — where to insert a new value to maintain sorted order.",
      "Range queries — finding the first or last occurrence of a value in a sorted sequence.",
      "Applications in system software: OS page tables, dictionary lookups, IP routing tables.",
    ],

    complexity: {
      time: {
        best: {
          value: "O(1)",
          note: "Target is exactly at the midpoint on the first comparison.",
        },
        average: {
          value: "O(log n)",
          note: "Each step eliminates half the remaining candidates.",
        },
        worst: {
          value: "O(log n)",
          note: "Target is at an extreme or absent — maximum log₂(n) + 1 comparisons needed.",
        },
      },
      space: {
        value: "O(1)",
        note: "Iterative implementation uses only two index variables regardless of array size.",
      },
    },
  },

  code: {
    javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,

    python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,

    java: `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,

    cpp: `int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
};
