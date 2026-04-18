import type { GraphNode, GraphEdge, GraphFrame } from "@/types/algorithm";

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startId: string;
}

// Arrange nodes in a circle within a 500x320 SVG viewbox
function circleLayout(ids: string[]): Pick<GraphNode, "id" | "x" | "y">[] {
  const cx = 250, cy = 155, rx = 180, ry = 120;
  return ids.map((id, i) => {
    const angle = (2 * Math.PI * i) / ids.length - Math.PI / 2;
    return { id, x: Math.round(cx + rx * Math.cos(angle)), y: Math.round(cy + ry * Math.sin(angle)) };
  });
}

export function generateRandomGraph(nodeCount: number, edgeCount: number, weighted = false): GraphData {
  const ids = Array.from({ length: nodeCount }, (_, i) => String.fromCharCode(65 + i));
  const positions = circleLayout(ids);
  const nodes: GraphNode[] = positions.map((p) => ({ ...p, state: "unvisited" }));

  const edges: GraphEdge[] = [];
  const edgeSet = new Set<string>();

  // ensure connectivity via a spanning path
  for (let i = 0; i < ids.length - 1; i++) {
    const key = `${ids[i]}-${ids[i + 1]}`;
    edges.push({ from: ids[i], to: ids[i + 1], state: "unvisited", weight: weighted ? Math.floor(Math.random() * 9) + 1 : undefined });
    edgeSet.add(key);
  }

  // add random extra edges
  let attempts = 0;
  while (edges.length < edgeCount && attempts < 200) {
    attempts++;
    const a = Math.floor(Math.random() * nodeCount);
    const b = Math.floor(Math.random() * nodeCount);
    if (a === b) continue;
    const key = `${ids[a]}-${ids[b]}`;
    const keyRev = `${ids[b]}-${ids[a]}`;
    if (edgeSet.has(key) || edgeSet.has(keyRev)) continue;
    edges.push({ from: ids[a], to: ids[b], state: "unvisited", weight: weighted ? Math.floor(Math.random() * 9) + 1 : undefined });
    edgeSet.add(key);
  }

  return { nodes, edges, startId: ids[0] };
}

export function toInitialFrame(data: GraphData): GraphFrame {
  return {
    nodes: data.nodes.map((n) => ({ ...n, state: "unvisited" })),
    edges: data.edges.map((e) => ({ ...e, state: "unvisited" })),
  };
}

// Build adjacency list from edges (undirected)
export function buildAdjacency(edges: GraphEdge[]): Map<string, { id: string; weight: number }[]> {
  const adj = new Map<string, { id: string; weight: number }[]>();
  for (const e of edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    if (!adj.has(e.to)) adj.set(e.to, []);
    adj.get(e.from)!.push({ id: e.to, weight: e.weight ?? 1 });
    adj.get(e.to)!.push({ id: e.from, weight: e.weight ?? 1 });
  }
  return adj;
}
