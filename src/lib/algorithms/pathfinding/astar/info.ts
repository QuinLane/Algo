import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `A* (A-star) is a best-first search algorithm that finds the shortest path between two points on a grid or graph. It combines the cost of reaching a node from the start (g) with a heuristic estimate of the remaining distance to the goal (h), prioritizing nodes with the lowest combined score f = g + h.

This heuristic guidance makes A* significantly more efficient than Dijkstra's algorithm in practice — instead of expanding outward in all directions equally, A* steers toward the goal. With an admissible heuristic (one that never overestimates), A* is guaranteed to find the optimal path.`,

    howItWorks: [
      "Initialize an open set with the start node. Assign g=0 and h=heuristic(start, end).",
      "Pick the node with the lowest f=g+h from the open set as the current node.",
      "If the current node is the goal, reconstruct and return the path.",
      "Move the current node from open to closed (already evaluated).",
      "For each passable neighbor: compute g = current.g + 1. If this g is better than any previous, update and add to open.",
      "Repeat until the goal is reached or the open set is empty (no path exists).",
    ],

    useCases: [
      "Game AI pathfinding — NPCs navigating maps and avoiding obstacles in real time.",
      "GPS and mapping — finding optimal routes across road networks.",
      "Robotics — motion planning for autonomous vehicles and drones.",
      "Puzzle solving — sliding puzzles, maze navigation, and any grid-based optimization.",
    ],

    complexity: {
      time: {
        best: {
          value: "O(1)",
          note: "Goal is immediately adjacent to start.",
        },
        average: {
          value: "O(b^d)",
          note: "b is branching factor, d is depth of solution. With a good heuristic this is much better than Dijkstra.",
        },
        worst: {
          value: "O(b^d)",
          note: "Degenerate heuristic reduces to Dijkstra's behavior.",
        },
      },
      space: {
        value: "O(b^d)",
        note: "Open and closed sets can hold all generated nodes in the worst case.",
      },
    },
  },

  code: {
    javascript: `function aStar(grid, start, end) {
  const open = new Map();
  const closed = new Set();
  const parent = new Map();

  const h = ([r, c]) => Math.abs(r - end[0]) + Math.abs(c - end[1]);
  const key = ([r, c]) => \`\${r},\${c}\`;

  open.set(key(start), { pos: start, g: 0, f: h(start) });

  while (open.size > 0) {
    const current = [...open.values()].reduce((a, b) => a.f < b.f ? a : b);
    if (key(current.pos) === key(end)) return reconstruct(parent, current.pos);

    open.delete(key(current.pos));
    closed.add(key(current.pos));

    for (const neighbor of getNeighbors(grid, current.pos)) {
      if (closed.has(key(neighbor))) continue;
      const g = current.g + 1;
      const existing = open.get(key(neighbor));
      if (!existing || g < existing.g) {
        parent.set(key(neighbor), current.pos);
        open.set(key(neighbor), { pos: neighbor, g, f: g + h(neighbor) });
      }
    }
  }
  return null; // no path
}`,

    python: `import heapq

def a_star(grid, start, end):
    h = lambda pos: abs(pos[0]-end[0]) + abs(pos[1]-end[1])
    open_set = [(h(start), 0, start, None)]
    came_from = {}
    g_score = {start: 0}

    while open_set:
        _, g, current, parent = heapq.heappop(open_set)
        if current in came_from:
            continue
        came_from[current] = parent
        if current == end:
            return reconstruct(came_from, end)
        for neighbor in get_neighbors(grid, current):
            new_g = g + 1
            if new_g < g_score.get(neighbor, float('inf')):
                g_score[neighbor] = new_g
                f = new_g + h(neighbor)
                heapq.heappush(open_set, (f, new_g, neighbor, current))
    return None`,

    java: `public List<int[]> aStar(int[][] grid, int[] start, int[] end) {
    PriorityQueue<int[]> open = new PriorityQueue<>(Comparator.comparingInt(a -> a[2]));
    Map<String, int[]> parent = new HashMap<>();
    Map<String, Integer> gScore = new HashMap<>();

    String startKey = start[0] + "," + start[1];
    open.offer(new int[]{start[0], start[1], h(start, end)});
    gScore.put(startKey, 0);

    while (!open.isEmpty()) {
        int[] cur = open.poll();
        String curKey = cur[0] + "," + cur[1];
        if (cur[0] == end[0] && cur[1] == end[1])
            return reconstruct(parent, end);
        for (int[] nb : getNeighbors(grid, cur)) {
            String nbKey = nb[0] + "," + nb[1];
            int g = gScore.getOrDefault(curKey, Integer.MAX_VALUE) + 1;
            if (g < gScore.getOrDefault(nbKey, Integer.MAX_VALUE)) {
                gScore.put(nbKey, g);
                parent.put(nbKey, cur);
                open.offer(new int[]{nb[0], nb[1], g + h(nb, end)});
            }
        }
    }
    return null;
}`,

    cpp: `vector<pair<int,int>> aStar(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> end) {
    auto h = [&](pair<int,int> p) {
        return abs(p.first - end.first) + abs(p.second - end.second);
    };
    using State = tuple<int, pair<int,int>>;
    priority_queue<State, vector<State>, greater<>> open;
    map<pair<int,int>, pair<int,int>> parent;
    map<pair<int,int>, int> g;

    g[start] = 0;
    open.push({h(start), start});

    while (!open.empty()) {
        auto [f, cur] = open.top(); open.pop();
        if (cur == end) return reconstruct(parent, end);
        for (auto nb : getNeighbors(grid, cur)) {
            int ng = g[cur] + 1;
            if (!g.count(nb) || ng < g[nb]) {
                g[nb] = ng;
                parent[nb] = cur;
                open.push({ng + h(nb), nb});
            }
        }
    }
    return {};
}`,
  },
};
