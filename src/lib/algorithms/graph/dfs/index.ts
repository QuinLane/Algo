import type { GraphTrace, GraphNode, GraphEdge } from "@/types/algorithm";
import type { GraphData } from "@/lib/utils/graphUtils";
import { buildAdjacency } from "@/lib/utils/graphUtils";

export function dfs(data: GraphData): GraphTrace {
  const frames: GraphTrace["frames"] = [];
  let nodesVisited = 0;
  let edgesRelaxed = 0;

  const nodes = data.nodes.map((n): GraphNode => ({ ...n, state: "unvisited" }));
  const edges = data.edges.map((e): GraphEdge => ({ ...e, state: "unvisited" }));
  const adj = buildAdjacency(edges);

  const snap = (stack: string[]) =>
    frames.push({
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      stack: [...stack],
    });

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;
  const getEdge = (a: string, b: string) =>
    edges.find((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a));

  snap([]);

  const visited = new Set<string>();
  const callStack: string[] = [];

  function visit(id: string) {
    visited.add(id);
    getNode(id).state = "visiting";
    callStack.push(id);
    snap([...callStack]);

    for (const neighbor of adj.get(id) ?? []) {
      edgesRelaxed++;
      const edge = getEdge(id, neighbor.id);
      if (edge) edge.state = "active";
      snap([...callStack]);

      if (!visited.has(neighbor.id)) {
        if (edge) edge.state = "visited";
        visit(neighbor.id);
      } else {
        if (edge && edge.state === "active") edge.state = "visited";
      }
    }

    getNode(id).state = "visited";
    nodesVisited++;
    callStack.pop();
    snap([...callStack]);
  }

  visit(data.startId);

  return { frames, nodesVisited, edgesRelaxed };
}
