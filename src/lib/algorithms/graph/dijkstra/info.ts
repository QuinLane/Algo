import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Dijkstra's algorithm finds the shortest path from a single source node to all other nodes in a graph with non-negative edge weights. It works greedily: at each step it selects the unvisited node with the smallest known distance from the source, finalizes that distance, and uses it to update (relax) the distances to its neighbors.

The key insight is that once a node is selected as the "current minimum," its shortest path is finalized — no future path through an unvisited node can be shorter, provided all edge weights are non-negative. This greedy property does not hold for graphs with negative weights; the Bellman-Ford algorithm handles those cases instead. Dijkstra's with a binary heap priority queue runs in O((V + E) log V), making it practical for large sparse graphs.`,

    howItWorks: [
      "Initialize all distances to infinity, except the source which is set to 0.",
      "Add the source to a min-priority queue with distance 0.",
      "Dequeue the node with the smallest tentative distance.",
      "If this node has already been finalized (visited), skip it.",
      "Mark the node as visited — its shortest distance is now confirmed.",
      "For each unvisited neighbor, compute the candidate distance: current distance + edge weight.",
      "If the candidate distance is less than the neighbor's known distance, update it and enqueue the neighbor.",
      "Repeat from step 3 until the priority queue is empty.",
    ],

    useCases: [
      "GPS and mapping applications — finding shortest driving routes in road networks.",
      "Network routing protocols (OSPF) — routers use Dijkstra to compute shortest paths in the network topology.",
      "Game AI — pathfinding on weighted tile maps or navigation meshes.",
      "Any single-source shortest path problem on graphs with non-negative edge weights.",
    ],

    complexity: {
      time: {
        best: {
          value: "O((V + E) log V)",
          note: "With a binary heap priority queue — each vertex and edge processed once.",
        },
        average: {
          value: "O((V + E) log V)",
          note: "Typical for sparse graphs (E ≈ V). Dense graphs benefit from a Fibonacci heap: O(V log V + E).",
        },
        worst: {
          value: "O((V + E) log V)",
          note: "Fully connected graph — all edges are relaxed, each enqueue/dequeue is O(log V).",
        },
      },
      space: {
        value: "O(V)",
        note: "Distance array and priority queue each hold at most V entries.",
      },
    },
  },

  code: {
    javascript: `function dijkstra(graph, start) {
  const dist = {};
  const visited = new Set();
  const pq = [[0, start]]; // [distance, node]

  for (const node in graph) dist[node] = Infinity;
  dist[start] = 0;

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);

    for (const [v, weight] of graph[u] || []) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,

    python: `import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]  # (distance, node)
    visited = set()

    while pq:
        d, u = heapq.heappop(pq)
        if u in visited:
            continue
        visited.add(u)
        for v, weight in graph.get(u, []):
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
    return dist`,

    java: `public static Map<Integer, Integer> dijkstra(
    Map<Integer, List<int[]>> graph, int start
) {
    Map<Integer, Integer> dist = new HashMap<>();
    for (int node : graph.keySet()) dist.put(node, Integer.MAX_VALUE);
    dist.put(start, 0);

    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.offer(new int[]{0, start});
    Set<Integer> visited = new HashSet<>();

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0], u = curr[1];
        if (!visited.add(u)) continue;
        for (int[] edge : graph.getOrDefault(u, List.of())) {
            int v = edge[0], w = edge[1];
            if (dist.get(u) + w < dist.getOrDefault(v, Integer.MAX_VALUE)) {
                dist.put(v, dist.get(u) + w);
                pq.offer(new int[]{dist.get(v), v});
            }
        }
    }
    return dist;
}`,

    cpp: `unordered_map<int, int> dijkstra(
    unordered_map<int, vector<pair<int,int>>>& graph, int start
) {
    unordered_map<int, int> dist;
    for (auto& [node, _] : graph) dist[node] = INT_MAX;
    dist[start] = 0;

    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, start});
    unordered_set<int> visited;

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (!visited.insert(u).second) continue;
        for (auto [v, w] : graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
  },
};
