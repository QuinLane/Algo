import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Depth-First Search (DFS) explores a graph by going as deep as possible along each branch before backtracking. Starting from the source node, it follows a path all the way to a leaf (or a node with no unvisited neighbors) before reversing course and trying the next branch. This can be implemented with a call stack via recursion, or explicitly with a stack data structure.

Unlike BFS, DFS does not guarantee the shortest path, but it excels at problems that require exhaustive exploration — detecting cycles, finding connected components, topological sorting, and solving puzzles with a single solution path. Its memory footprint is proportional to the depth of the graph rather than its breadth, making it advantageous for wide, shallow graphs where BFS's queue would grow very large.`,

    howItWorks: [
      "Mark the source node as visited.",
      "Recursively (or using a stack) visit each unvisited neighbor of the current node.",
      "Go as deep as possible down one path before considering alternative neighbors.",
      "When a node has no unvisited neighbors, backtrack to the previous node.",
      "Continue backtracking and exploring until all nodes reachable from the source are visited.",
    ],

    useCases: [
      "Cycle detection — DFS identifies back edges, which indicate cycles in a graph.",
      "Topological sorting of directed acyclic graphs (DAGs) for dependency resolution.",
      "Finding strongly connected components (Tarjan's or Kosaraju's algorithms build on DFS).",
      "Maze generation and path-finding when any valid path (not the shortest) is acceptable.",
    ],

    complexity: {
      time: {
        best: {
          value: "O(V + E)",
          note: "Every vertex and edge is visited exactly once.",
        },
        average: {
          value: "O(V + E)",
          note: "Consistent regardless of graph topology.",
        },
        worst: {
          value: "O(V + E)",
          note: "A fully connected dense graph still processes each edge only once.",
        },
      },
      space: {
        value: "O(V)",
        note: "The recursion stack or explicit stack holds at most V frames in a deep path.",
      },
    },
  },

  code: {
    javascript: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  const order = [start];
  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      order.push(...dfs(graph, neighbor, visited));
    }
  }
  return order;
}`,

    python: `def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    order = [start]
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            order.extend(dfs(graph, neighbor, visited))
    return order`,

    java: `public static List<Integer> dfs(Map<Integer, List<Integer>> graph, int start) {
    List<Integer> order = new ArrayList<>();
    dfsHelper(graph, start, new HashSet<>(), order);
    return order;
}

private static void dfsHelper(
    Map<Integer, List<Integer>> graph,
    int node,
    Set<Integer> visited,
    List<Integer> order
) {
    visited.add(node);
    order.add(node);
    for (int neighbor : graph.getOrDefault(node, List.of())) {
        if (!visited.contains(neighbor)) {
            dfsHelper(graph, neighbor, visited, order);
        }
    }
}`,

    cpp: `void dfsHelper(
    unordered_map<int, vector<int>>& graph,
    int node,
    unordered_set<int>& visited,
    vector<int>& order
) {
    visited.insert(node);
    order.push_back(node);
    for (int neighbor : graph[node]) {
        if (!visited.count(neighbor)) {
            dfsHelper(graph, neighbor, visited, order);
        }
    }
}

vector<int> dfs(unordered_map<int, vector<int>>& graph, int start) {
    unordered_set<int> visited;
    vector<int> order;
    dfsHelper(graph, start, visited, order);
    return order;
}`,
  },
};
