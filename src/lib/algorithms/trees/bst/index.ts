import type { TreeTrace, TreeNodeState } from "@/types/algorithm";
import { buildFrame, getTreeHeight, type RawNode } from "@/lib/utils/treeUtils";

export function buildBST(values: number[]): TreeTrace {
  const frames = [];
  const nodeMap = new Map<number, RawNode>();
  let rootId: number | null = null;
  let nextId = 0;
  let comparisons = 0;

  for (const value of values) {
    const newId = nextId++;
    const newNode: RawNode = { id: newId, value, left: null, right: null, parent: null };

    if (rootId === null) {
      rootId = newId;
      nodeMap.set(newId, newNode);
      const states = new Map<number, TreeNodeState>([[newId, "inserted"]]);
      frames.push(buildFrame(nodeMap, rootId, states, comparisons, `Insert ${value} as root`));
      continue;
    }

    nodeMap.set(newId, newNode);

    // Walk down the tree, recording each comparison
    const pathIds: number[] = [];
    let curId = rootId;

    while (true) {
      const cur = nodeMap.get(curId)!;
      comparisons++;
      pathIds.push(curId);

      // Snapshot: highlight path so far, active on current
      const states = new Map<number, TreeNodeState>();
      for (const id of pathIds.slice(0, -1)) states.set(id, "path");
      states.set(curId, "active");
      frames.push(
        buildFrame(
          nodeMap,
          rootId,
          states,
          comparisons,
          `Insert ${value}: compare with ${cur.value}`
        )
      );

      if (value < cur.value) {
        if (cur.left === null) {
          cur.left = newId;
          newNode.parent = curId;
          const insertStates = new Map<number, TreeNodeState>();
          for (const id of pathIds) insertStates.set(id, "path");
          insertStates.set(newId, "inserted");
          frames.push(
            buildFrame(
              nodeMap,
              rootId,
              insertStates,
              comparisons,
              `Insert ${value} as left child of ${cur.value}`
            )
          );
          break;
        }
        curId = cur.left;
      } else {
        if (cur.right === null) {
          cur.right = newId;
          newNode.parent = curId;
          const insertStates = new Map<number, TreeNodeState>();
          for (const id of pathIds) insertStates.set(id, "path");
          insertStates.set(newId, "inserted");
          frames.push(
            buildFrame(
              nodeMap,
              rootId,
              insertStates,
              comparisons,
              `Insert ${value} as right child of ${cur.value}`
            )
          );
          break;
        }
        curId = cur.right;
      }
    }

    // Rest frame: all default
    frames.push(buildFrame(nodeMap, rootId, new Map(), comparisons));
  }

  // Final frame showing complete tree
  frames.push(
    buildFrame(nodeMap, rootId, new Map(), comparisons, "BST construction complete")
  );

  return {
    frames,
    totalComparisons: comparisons,
    treeHeight: getTreeHeight(nodeMap, rootId),
  };
}
