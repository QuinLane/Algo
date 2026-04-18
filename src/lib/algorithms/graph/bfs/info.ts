import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Breadth-First Search (BFS) explores a graph level by level, visiting all neighbors of the current node before moving deeper. It uses a queue to track the order of exploration: the node visited first has its neighbors explored first, ensuring that nodes are discovered in order of increasing distance from the source.

BFS is guaranteed to find the shortest path (in terms of number of edges) between the source and any reachable node in an unweighted graph. This property makes it the foundation for many practical algorithms, from social network analysis to maze-solving and web crawlers. Its O(V + E) time complexity ensures every vertex and edge is processed exactly once.`,

    howItWorks: [
      "Mark the source node as visited and enqueue it.",
      "Dequeue the front node and process it (record it as visited).",
      "For each unvisited neighbor of the current node, mark it visited and enqueue it.",
      "Repeat: dequeue the next node and explore its unvisited neighbors.",
      "Continue until the queue is empty — all reachable nodes have been visited.",
      "Nodes discovered earlier (closer to the source) are always processed before later ones.",
    ],

    useCases: [
      "Shortest path in unweighted graphs — BFS guarantees the minimum edge-count path.",
      "Web crawling — discovering pages layer by layer from a starting URL.",
      "Social network analysis — finding friends within N degrees of separation.",
      "Level-order traversal of trees, connectivity checks, and bipartite graph detection.",
    ],

    complexity: {
      time: {
        best: {
          value: "O(V + E)",
          note: "Every vertex and edge is enqueued and processed exactly once.",
        },
        average: {
          value: "O(V + E)",
          note: "Consistent regardless of graph structure.",
        },
        worst: {
          value: "O(V + E)",
          note: "Dense graphs with many edges still process each edge only once.",
        },
      },
      space: {
        value: "O(V)",
        note: "The queue and visited set each hold at most V nodes simultaneously.",
      },
    },
  },

  code: {
    javascript: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}`,

    python: `from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`,

    java: `public static List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    List<Integer> order = new ArrayList<>();

    visited.add(start);
    queue.add(start);

    while (!queue.isEmpty()) {
        int node = queue.poll();
        order.add(node);
        for (int neighbor : graph.getOrDefault(node, List.of())) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }
    return order;
}`,

    cpp: `vector<int> bfs(unordered_map<int, vector<int>>& graph, int start) {
    unordered_set<int> visited = {start};
    queue<int> q;
    q.push(start);
    vector<int> order;

    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int neighbor : graph[node]) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return order;
}`,
  },
};
