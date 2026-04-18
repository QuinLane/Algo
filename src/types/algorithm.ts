// Sorting

export interface SortFrame {
  array: number[];
  compared: number[];
  swapped: number[];
  sorted: number[];
  auxiliary?: number[];
  pivot?: number;
}

export interface SortTrace {
  frames: SortFrame[];
  comparisons: number;
  writes: number;
}

// Searching

export interface SearchFrame {
  array: number[];
  target: number;
  current: number;
  low?: number;
  mid?: number;
  high?: number;
  found: boolean;
}

export interface SearchTrace {
  frames: SearchFrame[];
  comparisons: number;
  found: boolean;
  foundIndex: number;
}

// Graph

export type NodeState = "unvisited" | "visiting" | "visited";
export type EdgeState = "unvisited" | "active" | "visited";

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  state: NodeState;
  distance?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  state: EdgeState;
}

export interface GraphFrame {
  nodes: GraphNode[];
  edges: GraphEdge[];
  queue?: string[];
  stack?: string[];
  distances?: Record<string, number>;
}

export interface GraphTrace {
  frames: GraphFrame[];
  nodesVisited: number;
  edgesRelaxed: number;
}

// Shared

export type AlgorithmCategory = "sort" | "search" | "graph";

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  route: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}
