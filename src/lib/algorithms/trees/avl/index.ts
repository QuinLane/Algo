import type { TreeTrace, TreeFrame, TreeNodeState } from "@/types/algorithm";
import { buildFrame, getTreeHeight, type RawNode } from "@/lib/utils/treeUtils";

export function buildAVL(values: number[]): TreeTrace {
  const frames: TreeFrame[] = [];
  const nodeMap = new Map<number, RawNode>();
  let rootId: number | null = null;
  let nextId = 0;
  let comparisons = 0;

  function h(id: number | null): number {
    return id === null ? 0 : (nodeMap.get(id)?.height ?? 0);
  }

  // Post-order height/bf update — safe because AVL height is bounded O(log n)
  function recalcPost(id: number | null): void {
    if (id === null) return;
    const n = nodeMap.get(id)!;
    recalcPost(n.left);
    recalcPost(n.right);
    n.height = 1 + Math.max(h(n.left), h(n.right));
    n.balanceFactor = h(n.left) - h(n.right);
  }

  function getBf(id: number): number {
    const n = nodeMap.get(id)!;
    return h(n.left) - h(n.right);
  }

  // Rotations only modify left/right child pointers — no parent pointers touched.
  // The caller (pathIds walk-up) is responsible for updating the parent's child pointer.
  function rotateRight(y: number): number {
    const yNode = nodeMap.get(y)!;
    const x = yNode.left!;
    const xNode = nodeMap.get(x)!;
    yNode.left = xNode.right;
    xNode.right = y;
    // Update heights bottom-up: y is now a child of x
    yNode.height = 1 + Math.max(h(yNode.left), h(yNode.right));
    xNode.height = 1 + Math.max(h(xNode.left), h(xNode.right));
    return x;
  }

  function rotateLeft(x: number): number {
    const xNode = nodeMap.get(x)!;
    const y = xNode.right!;
    const yNode = nodeMap.get(y)!;
    xNode.right = yNode.left;
    yNode.left = x;
    xNode.height = 1 + Math.max(h(xNode.left), h(xNode.right));
    yNode.height = 1 + Math.max(h(yNode.left), h(yNode.right));
    return y;
  }

  function snap(
    states: Map<number, TreeNodeState>,
    insertionIndex: number | undefined,
    message?: string
  ): void {
    recalcPost(rootId);
    frames.push(buildFrame(nodeMap, rootId, states, comparisons, message, undefined, insertionIndex));
  }

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    if (rootId === null) {
      const newId = nextId++;
      nodeMap.set(newId, { id: newId, value, left: null, right: null, parent: null, height: 1, balanceFactor: 0 });
      rootId = newId;
      snap(new Map([[newId, "inserted"]]), i, `Insert ${value} as root`);
      snap(new Map(), i);
      continue;
    }

    // Iterative descent — collect path for rebalance walk-up
    const pathIds: number[] = [];
    let curId = rootId;

    while (true) {
      const cur = nodeMap.get(curId)!;
      comparisons++;
      pathIds.push(curId);

      const states = new Map<number, TreeNodeState>();
      for (const pid of pathIds.slice(0, -1)) states.set(pid, "path");
      states.set(curId, "active");
      snap(states, i, `Insert ${value}: compare with ${cur.value}`);

      if (value < cur.value) {
        if (cur.left === null) {
          const newId = nextId++;
          nodeMap.set(newId, { id: newId, value, left: null, right: null, parent: null, height: 1, balanceFactor: 0 });
          cur.left = newId;
          const ins = new Map<number, TreeNodeState>();
          for (const pid of pathIds) ins.set(pid, "path");
          ins.set(newId, "inserted");
          snap(ins, i, `Inserted ${value}`);
          break;
        }
        curId = cur.left;
      } else {
        if (cur.right === null) {
          const newId = nextId++;
          nodeMap.set(newId, { id: newId, value, left: null, right: null, parent: null, height: 1, balanceFactor: 0 });
          cur.right = newId;
          const ins = new Map<number, TreeNodeState>();
          for (const pid of pathIds) ins.set(pid, "path");
          ins.set(newId, "inserted");
          snap(ins, i, `Inserted ${value}`);
          break;
        }
        curId = cur.right;
      }
    }

    // Walk back up pathIds to find and fix any imbalance
    for (let j = pathIds.length - 1; j >= 0; j--) {
      const nodeId = pathIds[j];
      const node = nodeMap.get(nodeId)!;
      // Recompute height for this node before checking balance
      node.height = 1 + Math.max(h(node.left), h(node.right));
      const balance = getBf(nodeId);

      if (Math.abs(balance) > 1) {
        let rotType: string;
        let newTop: number;

        if (balance > 1) {
          if (getBf(node.left!) < 0) {
            rotType = "LR";
            node.left = rotateLeft(node.left!);
            newTop = rotateRight(nodeId);
          } else {
            rotType = "LL";
            newTop = rotateRight(nodeId);
          }
        } else {
          if (getBf(node.right!) > 0) {
            rotType = "RL";
            node.right = rotateRight(node.right!);
            newTop = rotateLeft(nodeId);
          } else {
            rotType = "RR";
            newTop = rotateLeft(nodeId);
          }
        }

        // Attach new subtree root to its parent
        if (j > 0) {
          const parent = nodeMap.get(pathIds[j - 1])!;
          if (parent.left === nodeId) parent.left = newTop;
          else parent.right = newTop;
        } else {
          rootId = newTop;
        }

        snap(new Map([[newTop, "rotated"]]), i, `${rotType} rotation at ${node.value}`);
        snap(new Map([[newTop, "inserted"]]), i, `After ${rotType} rotation`);
        break; // AVL: at most one rotation per insertion
      }
    }

    snap(new Map(), i);
  }

  recalcPost(rootId);
  snap(new Map(), undefined, "AVL tree construction complete");

  return {
    frames,
    totalComparisons: comparisons,
    treeHeight: getTreeHeight(nodeMap, rootId),
  };
}
