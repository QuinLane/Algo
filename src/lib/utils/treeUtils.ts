import type { TreeNode, TreeNodeState, TreeFrame } from "@/types/algorithm";

const NODE_RADIUS = 20;
const X_SPACING = 52;
const Y_SPACING = 72;
const PADDING = 28;

export interface RawNode {
  id: number;
  value: number;
  left: number | null;
  right: number | null;
  parent: number | null;
  height?: number;
  balanceFactor?: number;
}

export function computeLayout(
  nodeMap: Map<number, RawNode>,
  rootId: number | null,
  states: Map<number, TreeNodeState>
): TreeNode[] {
  const positions = new Map<number, { x: number; y: number }>();
  let inorderIdx = 0;

  function inorder(id: number | null, depth: number) {
    if (id === null || !nodeMap.has(id)) return;
    const node = nodeMap.get(id)!;
    inorder(node.left, depth + 1);
    positions.set(id, {
      x: PADDING + inorderIdx * X_SPACING,
      y: PADDING + NODE_RADIUS + depth * Y_SPACING,
    });
    inorderIdx++;
    inorder(node.right, depth + 1);
  }

  inorder(rootId, 0);

  return [...nodeMap.values()].map((raw): TreeNode => ({
    id: raw.id,
    value: raw.value,
    leftId: raw.left,
    rightId: raw.right,
    parentId: raw.parent,
    x: positions.get(raw.id)?.x ?? 0,
    y: positions.get(raw.id)?.y ?? 0,
    state: states.get(raw.id) ?? "default",
    height: raw.height,
    balanceFactor: raw.balanceFactor,
  }));
}

export function getTreeHeight(nodeMap: Map<number, RawNode>, id: number | null): number {
  if (id === null || !nodeMap.has(id)) return 0;
  const node = nodeMap.get(id)!;
  return 1 + Math.max(getTreeHeight(nodeMap, node.left), getTreeHeight(nodeMap, node.right));
}

export function buildFrame(
  nodeMap: Map<number, RawNode>,
  rootId: number | null,
  states: Map<number, TreeNodeState>,
  comparisons: number,
  message?: string,
  outputList?: number[]
): TreeFrame {
  return {
    nodes: computeLayout(nodeMap, rootId, states),
    rootId,
    message,
    outputList: outputList !== undefined ? [...outputList] : undefined,
    comparisons,
  };
}

export function cloneNodeMap(nodeMap: Map<number, RawNode>): Map<number, RawNode> {
  const clone = new Map<number, RawNode>();
  for (const [id, node] of nodeMap) {
    clone.set(id, { ...node });
  }
  return clone;
}
