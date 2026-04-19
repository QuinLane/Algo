import type { AlgorithmMeta } from "@/types/algorithm";

export const registry: AlgorithmMeta[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "sort",
    route: "/sort/bubble",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order.",
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    category: "sort",
    route: "/sort/insertion",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Builds the sorted array one item at a time by inserting each element into its correct position.",
  },
  {
    id: "selection-sort",
    name: "Selection Sort",
    category: "sort",
    route: "/sort/selection",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Repeatedly finds the minimum element from the unsorted portion and places it at the beginning.",
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    category: "sort",
    route: "/sort/merge",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description:
      "Divides the array in half, recursively sorts each half, then merges the sorted halves.",
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "sort",
    route: "/sort/quick",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    description:
      "Selects a pivot element and partitions the array around it, recursively sorting each partition.",
  },
  {
    id: "heap-sort",
    name: "Heap Sort",
    category: "sort",
    route: "/sort/heap",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    description:
      "Builds a max-heap from the array, then repeatedly extracts the maximum to produce a sorted array.",
  },
  {
    id: "linear-search",
    name: "Linear Search",
    category: "search",
    route: "/search/linear",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description:
      "Sequentially checks each element until the target is found or the list is exhausted.",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "search",
    route: "/search/binary",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Repeatedly divides a sorted array in half to narrow down the search range.",
  },
  {
    id: "bfs",
    name: "Breadth-First Search",
    category: "graph",
    route: "/graph/bfs",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    description:
      "Explores all neighbors of a node before moving deeper, using a queue to track order.",
  },
  {
    id: "dfs",
    name: "Depth-First Search",
    category: "graph",
    route: "/graph/dfs",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    description:
      "Explores as far as possible along each branch before backtracking, using a stack.",
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "graph",
    route: "/graph/dijkstra",
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V)",
    description:
      "Finds the shortest path from a source node to all other nodes in a weighted graph.",
  },
  {
    id: "astar",
    name: "A* Search",
    category: "pathfinding",
    route: "/pathfinding/astar",
    timeComplexity: "O(b^d)",
    spaceComplexity: "O(b^d)",
    description:
      "Finds the shortest path on a grid using a heuristic to steer exploration toward the goal.",
  },
  {
    id: "dijkstra-grid",
    name: "Dijkstra (Grid)",
    category: "pathfinding",
    route: "/pathfinding/dijkstra",
    timeComplexity: "O(V log V)",
    spaceComplexity: "O(V)",
    description:
      "Finds the shortest grid path without a heuristic, expanding outward uniformly from the start.",
  },
  {
    id: "bst",
    name: "Binary Search Tree",
    category: "tree",
    route: "/trees/bst",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    description:
      "A tree where each node's left subtree holds smaller values and right subtree holds larger values, enabling efficient search and insertion.",
  },
  {
    id: "avl",
    name: "AVL Tree",
    category: "tree",
    route: "/trees/avl",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    description:
      "A self-balancing BST that performs rotations after each insertion to keep the tree height within O(log n).",
  },
  {
    id: "tree-traversals",
    name: "Tree Traversals",
    category: "tree",
    route: "/trees/traversals",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    description:
      "In-order, pre-order, and post-order traversals visit every node in a binary tree in a defined sequence.",
  },
];

export const sortAlgorithms = registry.filter((a) => a.category === "sort");
export const searchAlgorithms = registry.filter((a) => a.category === "search");
export const graphAlgorithms = registry.filter((a) => a.category === "graph");
export const pathfindingAlgorithms = registry.filter((a) => a.category === "pathfinding");
export const treeAlgorithms = registry.filter((a) => a.category === "tree");
