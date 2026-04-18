import type { GraphTrace, GraphNode, GraphEdge } from "@/types/algorithm";
import type { GraphData } from "@/lib/utils/graphUtils";
import { buildAdjacency } from "@/lib/utils/graphUtils";

export function dijkstra(data: GraphData): GraphTrace {
  const frames: GraphTrace["frames"] = [];
  let nodesVisited = 0;
  let edgesRelaxed = 0;

  const nodes = data.nodes.map((n): GraphNode => ({ ...n, state: "unvisited", distance: Infinity }));
  const edges = data.edges.map((e): GraphEdge => ({ ...e, state: "unvisited" }));
  const adj = buildAdjacency(edges);

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;
  const getEdge = (a: string, b: string) =>
    edges.find((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a));

  const distances: Record<string, number> = {};
  for (const n of nodes) distances[n.id] = Infinity;
  distances[data.startId] = 0;
  getNode(data.startId).distance = 0;

  const snap = () =>
    frames.push({
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      distances: { ...distances },
    });

  snap();

  const unvisited = new Set(nodes.map((n) => n.id));

  while (unvisited.size > 0) {
    // pick unvisited node with minimum distance
    let current: string | null = null;
    let minDist = Infinity;
    for (const id of unvisited) {
      if (distances[id] < minDist) { minDist = distances[id]; current = id; }
    }
    if (current === null || distances[current] === Infinity) break;

    unvisited.delete(current);
    getNode(current).state = "visiting";
    snap();

    for (const neighbor of adj.get(current) ?? []) {
      if (!unvisited.has(neighbor.id)) continue;
      edgesRelaxed++;
      const edge = getEdge(current, neighbor.id);
      if (edge) edge.state = "active";

      const alt = distances[current] + neighbor.weight;
      if (alt < distances[neighbor.id]) {
        distances[neighbor.id] = alt;
        getNode(neighbor.id).distance = alt;
      }
      snap();
      if (edge) edge.state = "visited";
    }

    getNode(current).state = "visited";
    nodesVisited++;
    snap();
  }

  return { frames, nodesVisited, edgesRelaxed };
}
