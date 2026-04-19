import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Dijkstra's algorithm on a grid finds the shortest path between a start and end cell by expanding outward in order of increasing cost. Unlike A*, it uses no heuristic — it explores all directions equally until the goal is reached or all reachable cells are exhausted.

On a uniform-cost grid (all moves cost 1), Dijkstra explores cells in concentric rings of increasing distance from the start, guaranteeing the shortest path. This makes it optimal but slower than A* on large open grids, since it cannot steer toward the goal.`,

    howItWorks: [
      "Initialize a priority queue with the start cell at distance 0. All other cells start at infinity.",
      "Dequeue the cell with the smallest known distance as the current cell.",
      "For each passable neighbor of the current cell, compute the new distance = current distance + 1.",
      "If the new distance is shorter than the recorded distance, update and re-enqueue the neighbor.",
      "Continue until the goal cell is dequeued — its recorded distance is the shortest path length.",
      "Reconstruct the path by following parent pointers back from goal to start.",
    ],

    useCases: [
      "Guaranteed shortest-path routing when no heuristic is available or all edge costs are equal.",
      "Network routing protocols (OSPF uses a variant of Dijkstra).",
      "Comparing against A* to understand the cost of heuristic-free search.",
      "Solving grid mazes when every cell-to-cell cost is uniform.",
    ],

    complexity: {
      time: {
        best: {
          value: "O(V)",
          note: "Goal is immediately adjacent and found without much exploration.",
        },
        average: {
          value: "O(V log V)",
          note: "With a binary heap priority queue, each cell is processed once.",
        },
        worst: {
          value: "O(V log V)",
          note: "All V cells must be explored before the goal is reached or unreachable.",
        },
      },
      space: {
        value: "O(V)",
        note: "Distance map, priority queue, and parent map each hold at most V entries.",
      },
    },
  },

  code: {
    javascript: `function dijkstraGrid(grid, start, end) {
  const dist = new Map();
  const parent = new Map();
  const visited = new Set();
  const key = ([r, c]) => \`\${r},\${c}\`;

  dist.set(key(start), 0);
  const queue = [[0, start]]; // [dist, pos]

  while (queue.length > 0) {
    queue.sort((a, b) => a[0] - b[0]);
    const [d, cur] = queue.shift();
    if (visited.has(key(cur))) continue;
    visited.add(key(cur));

    if (key(cur) === key(end)) return reconstruct(parent, end);

    for (const nb of getNeighbors(grid, cur)) {
      const nd = d + 1;
      if (nd < (dist.get(key(nb)) ?? Infinity)) {
        dist.set(key(nb), nd);
        parent.set(key(nb), cur);
        queue.push([nd, nb]);
      }
    }
  }
  return null;
}`,

    python: `import heapq

def dijkstra_grid(grid, start, end):
    dist = {start: 0}
    parent = {}
    pq = [(0, start)]

    while pq:
        d, cur = heapq.heappop(pq)
        if d > dist.get(cur, float('inf')):
            continue
        if cur == end:
            return reconstruct(parent, end)
        for nb in get_neighbors(grid, cur):
            nd = d + 1
            if nd < dist.get(nb, float('inf')):
                dist[nb] = nd
                parent[nb] = cur
                heapq.heappush(pq, (nd, nb))
    return None`,

    java: `public List<int[]> dijkstraGrid(int[][] grid, int[] start, int[] end) {
    Map<String, Integer> dist = new HashMap<>();
    Map<String, int[]> parent = new HashMap<>();
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[2]));

    String startKey = start[0] + "," + start[1];
    dist.put(startKey, 0);
    pq.offer(new int[]{start[0], start[1], 0});

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        String curKey = cur[0] + "," + cur[1];
        if (cur[2] > dist.getOrDefault(curKey, Integer.MAX_VALUE)) continue;
        if (cur[0] == end[0] && cur[1] == end[1])
            return reconstruct(parent, end);
        for (int[] nb : getNeighbors(grid, cur)) {
            String nbKey = nb[0] + "," + nb[1];
            int nd = dist.get(curKey) + 1;
            if (nd < dist.getOrDefault(nbKey, Integer.MAX_VALUE)) {
                dist.put(nbKey, nd);
                parent.put(nbKey, cur);
                pq.offer(new int[]{nb[0], nb[1], nd});
            }
        }
    }
    return null;
}`,

    cpp: `vector<pair<int,int>> dijkstraGrid(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> end) {
    map<pair<int,int>, int> dist;
    map<pair<int,int>, pair<int,int>> parent;
    using State = pair<int, pair<int,int>>;
    priority_queue<State, vector<State>, greater<>> pq;

    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, cur] = pq.top(); pq.pop();
        if (d > dist[cur]) continue;
        if (cur == end) return reconstruct(parent, end);
        for (auto nb : getNeighbors(grid, cur)) {
            int nd = d + 1;
            if (!dist.count(nb) || nd < dist[nb]) {
                dist[nb] = nd;
                parent[nb] = cur;
                pq.push({nd, nb});
            }
        }
    }
    return {};
}`,
  },
};
