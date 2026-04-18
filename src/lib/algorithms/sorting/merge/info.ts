import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Merge sort is a classic divide-and-conquer algorithm with a guaranteed O(n log n) time complexity in all cases. It works by recursively splitting the array in half until each piece is a single element (inherently sorted), then merging those pieces back together in sorted order. The merge step is where the real work happens: two sorted halves are compared element by element and woven into a single sorted sequence.

Because it always divides evenly and the merge step is linear, merge sort achieves O(n log n) even in the worst case — unlike quicksort, which can degrade to O(n²). The trade-off is O(n) auxiliary space for the temporary arrays used during merging. Merge sort is also stable, preserving the relative order of equal elements, which makes it preferred when sort stability matters.`,

    howItWorks: [
      "If the array has one or zero elements, it is already sorted — return it.",
      "Find the midpoint and split the array into left and right halves.",
      "Recursively sort the left half.",
      "Recursively sort the right half.",
      "Merge the two sorted halves: compare the front elements of each half and take the smaller one into the result array.",
      "Append any remaining elements from whichever half is not yet exhausted.",
      "The merged result is returned up the call stack until the full array is sorted.",
    ],

    useCases: [
      "Sorting linked lists — merge sort's access pattern works naturally without random access.",
      "External sorting (data too large for RAM) — can process and merge sorted chunks from disk.",
      "When sort stability is required — equal elements maintain their original relative order.",
      "Situations where worst-case O(n log n) must be guaranteed (unlike quicksort's O(n²) worst case).",
    ],

    complexity: {
      time: {
        best: {
          value: "O(n log n)",
          note: "Always divides and merges — no early exit possible.",
        },
        average: {
          value: "O(n log n)",
          note: "log n levels of recursion, each with O(n) total merge work.",
        },
        worst: {
          value: "O(n log n)",
          note: "Guaranteed — the divide-and-conquer structure is input-independent.",
        },
      },
      space: {
        value: "O(n)",
        note: "Requires auxiliary arrays proportional to input size for the merge step.",
      },
    },
  },

  code: {
    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,

    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,

    java: `public static int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    int mid = arr.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
    return merge(left, right);
}

private static int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length];
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result[k++] = left[i++];
        else result[k++] = right[j++];
    }
    while (i < left.length) result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
    return result;
}`,

    cpp: `vector<int> mergeSort(vector<int> arr) {
    if (arr.size() <= 1) return arr;
    int mid = arr.size() / 2;
    auto left = mergeSort(vector<int>(arr.begin(), arr.begin() + mid));
    auto right = mergeSort(vector<int>(arr.begin() + mid, arr.end()));
    return merge(left, right);
}

vector<int> merge(vector<int>& left, vector<int>& right) {
    vector<int> result;
    int i = 0, j = 0;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) result.push_back(left[i++]);
        else result.push_back(right[j++]);
    }
    while (i < left.size()) result.push_back(left[i++]);
    while (j < right.size()) result.push_back(right[j++]);
    return result;
}`,
  },
};
