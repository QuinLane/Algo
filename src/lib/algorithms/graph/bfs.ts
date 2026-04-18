import type { GraphTrace, GraphFrame, GraphNode, GraphEdge } from "@/types/algorithm";
import type { GraphData } from "@/lib/utils/graphUtils";
import { buildAdjacency } from "@/lib/utils/graphUtils";

export function bfs(data: GraphData): GraphTrace {
  const frames: GraphTrace["frames"] = [];
  let nodesVisited = 0;
  let edgesRelaxed = 0;

  const nodes = data.nodes.map((n): GraphNode => ({ ...n, state: "unvisited" }));
  const edges = data.edges.map((e): GraphEdge => ({ ...e, state: "unvisited" }));
  const adj = buildAdjacency(edges);

  const snap = (queue: string[]) =>
    frames.push({
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      queue: [...queue],
    });

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;
  const getEdge = (a: string, b: string) =>
    edges.find((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a));

  snap([]);

  const visited = new Set<string>();
  const queue: string[] = [data.startId];
  visited.add(data.startId);
  getNode(data.startId).state = "visiting";
  snap([...queue]);

  while (queue.length) {
    const current = queue.shift()!;
    getNode(current).state = "visiting";
    snap([...queue]);

    for (const neighbor of adj.get(current) ?? []) {
      edgesRelaxed++;
      const edge = getEdge(current, neighbor.id);
      if (edge) edge.state = "active";

      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        getNode(neighbor.id).state = "visiting";
        queue.push(neighbor.id);
        snap([...queue]);
      }

      if (edge) edge.state = "visited";
    }

    getNode(current).state = "visited";
    nodesVisited++;
    snap([...queue]);
  }

  return { frames, nodesVisited, edgesRelaxed };
}
