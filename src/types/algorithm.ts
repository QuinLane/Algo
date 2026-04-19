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

// Pathfinding

export type CellState = "empty" | "wall" | "start" | "end" | "visited" | "frontier" | "path";

export interface Cell {
  row: number;
  col: number;
  state: CellState;
  g?: number;
  h?: number;
  f?: number;
}

export interface PathfindingFrame {
  grid: Cell[][];
  open: Array<[number, number]>;
  closed: Array<[number, number]>;
  current?: [number, number];
  path?: Array<[number, number]>;
}

export interface PathfindingTrace {
  frames: PathfindingFrame[];
  nodesExplored: number;
  pathLength: number;
  pathFound: boolean;
}

// Trees

export type TreeNodeState =
  | "default"
  | "active"
  | "path"
  | "inserted"
  | "rotated"
  | "found"
  | "highlighted";

export interface TreeNode {
  id: number;
  value: number;
  leftId: number | null;
  rightId: number | null;
  parentId: number | null;
  x: number;
  y: number;
  state: TreeNodeState;
  height?: number;
  balanceFactor?: number;
}

export interface TreeFrame {
  nodes: TreeNode[];
  rootId: number | null;
  message?: string;
  outputList?: number[];
  comparisons: number;
  insertionIndex?: number;
}

export interface TreeTrace {
  frames: TreeFrame[];
  totalComparisons: number;
  treeHeight: number;
}

// Dynamic Programming

export type DPCellState = "default" | "active" | "filled" | "dependency" | "result";

export interface DPCell {
  value: number | null;
  state: DPCellState;
}

export interface DPFrame {
  table: DPCell[][];
  message?: string;
  fills: number;
  depCells?: Array<[number, number]>;
}

export interface DPTrace {
  frames: DPFrame[];
  totalFills: number;
  result: number;
  mode: "1d" | "2d";
  rowHeaders?: string[];
  colHeaders?: string[];
}

// Shared

export type AlgorithmCategory = "sort" | "search" | "graph" | "pathfinding" | "tree" | "dynamic";

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  route: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}
