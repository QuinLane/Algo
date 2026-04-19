import type { TreeTrace, TreeNodeState } from "@/types/algorithm";
import { buildFrame, getTreeHeight, type RawNode } from "@/lib/utils/treeUtils";

export function buildBST(values: number[]): TreeTrace {
  const frames = [];
  const nodeMap = new Map<number, RawNode>();
  let rootId: number | null = null;
  let nextId = 0;
  let comparisons = 0;

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const newId = nextId++;
    const newNode: RawNode = { id: newId, value, left: null, right: null, parent: null };

    if (rootId === null) {
      rootId = newId;
      nodeMap.set(newId, newNode);
      frames.push(buildFrame(nodeMap, rootId, new Map([[newId, "inserted"]]), comparisons, `Insert ${value} as root`, undefined, i));
      frames.push(buildFrame(nodeMap, rootId, new Map(), comparisons, undefined, undefined, i));
      continue;
    }

    nodeMap.set(newId, newNode);

    const pathIds: number[] = [];
    let curId = rootId;

    while (true) {
      const cur = nodeMap.get(curId)!;
      comparisons++;
      pathIds.push(curId);

      const states = new Map<number, TreeNodeState>();
      for (const id of pathIds.slice(0, -1)) states.set(id, "path");
      states.set(curId, "active");
      frames.push(buildFrame(nodeMap, rootId, states, comparisons, `Insert ${value}: compare with ${cur.value}`, undefined, i));

      if (value < cur.value) {
        if (cur.left === null) {
          cur.left = newId;
          newNode.parent = curId;
          const ins = new Map<number, TreeNodeState>();
          for (const id of pathIds) ins.set(id, "path");
          ins.set(newId, "inserted");
          frames.push(buildFrame(nodeMap, rootId, ins, comparisons, `Insert ${value} as left child of ${cur.value}`, undefined, i));
          break;
        }
        curId = cur.left;
      } else {
        if (cur.right === null) {
          cur.right = newId;
          newNode.parent = curId;
          const ins = new Map<number, TreeNodeState>();
          for (const id of pathIds) ins.set(id, "path");
          ins.set(newId, "inserted");
          frames.push(buildFrame(nodeMap, rootId, ins, comparisons, `Insert ${value} as right child of ${cur.value}`, undefined, i));
          break;
        }
        curId = cur.right;
      }
    }

    frames.push(buildFrame(nodeMap, rootId, new Map(), comparisons, undefined, undefined, i));
  }

  frames.push(buildFrame(nodeMap, rootId, new Map(), comparisons, "BST construction complete"));

  return {
    frames,
    totalComparisons: comparisons,
    treeHeight: getTreeHeight(nodeMap, rootId),
  };
}
