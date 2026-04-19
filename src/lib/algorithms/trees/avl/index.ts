import type { TreeTrace, TreeNodeState } from "@/types/algorithm";
import { buildFrame, getTreeHeight, type RawNode } from "@/lib/utils/treeUtils";

type RotationType = "LL" | "RR" | "LR" | "RL";

export function buildAVL(values: number[]): TreeTrace {
  const frames = [];
  const nodeMap = new Map<number, RawNode>();
  let rootId: number | null = null;
  let nextId = 0;
  let comparisons = 0;

  function height(id: number | null): number {
    if (id === null) return 0;
    return nodeMap.get(id)?.height ?? 1;
  }

  function balanceFactor(id: number | null): number {
    if (id === null) return 0;
    const node = nodeMap.get(id)!;
    return height(node.left) - height(node.right);
  }

  function updateHeight(id: number) {
    const node = nodeMap.get(id)!;
    const h = 1 + Math.max(height(node.left), height(node.right));
    node.height = h;
    node.balanceFactor = balanceFactor(id);
  }

  function refreshAllBalanceFactors() {
    for (const id of nodeMap.keys()) updateHeight(id);
  }

  function rotateRight(yId: number): number {
    const y = nodeMap.get(yId)!;
    const xId = y.left!;
    const x = nodeMap.get(xId)!;
    const t2 = x.right;

    x.right = yId;
    y.left = t2;
    if (t2 !== null) nodeMap.get(t2)!.parent = yId;
    x.parent = y.parent;
    y.parent = xId;

    if (y.parent !== null) {
      const parent = nodeMap.get(y.parent)!;
      if (parent.left === yId) parent.left = xId;
      else parent.right = xId;
    }

    updateHeight(yId);
    updateHeight(xId);
    return xId;
  }

  function rotateLeft(xId: number): number {
    const x = nodeMap.get(xId)!;
    const yId = x.right!;
    const y = nodeMap.get(yId)!;
    const t2 = y.left;

    y.left = xId;
    x.right = t2;
    if (t2 !== null) nodeMap.get(t2)!.parent = xId;
    y.parent = x.parent;
    x.parent = yId;

    if (y.parent !== null) {
      const parent = nodeMap.get(y.parent)!;
      if (parent.left === xId) parent.left = yId;
      else parent.right = yId;
    }

    updateHeight(xId);
    updateHeight(yId);
    return yId;
  }

  function rebalance(id: number): number {
    updateHeight(id);
    const bf = balanceFactor(id);
    const node = nodeMap.get(id)!;

    if (bf > 1) {
      const leftBf = balanceFactor(node.left);
      if (leftBf < 0) {
        // LR rotation
        node.left = rotateLeft(node.left!);
        nodeMap.get(node.left)!.parent = id;
        return rotateRight(id);
      }
      // LL rotation
      return rotateRight(id);
    }

    if (bf < -1) {
      const rightBf = balanceFactor(node.right);
      if (rightBf > 0) {
        // RL rotation
        node.right = rotateRight(node.right!);
        nodeMap.get(node.right)!.parent = id;
        return rotateLeft(id);
      }
      // RR rotation
      return rotateLeft(id);
    }

    return id;
  }

  function getRotationType(id: number): RotationType | null {
    const bf = balanceFactor(id);
    const node = nodeMap.get(id)!;
    if (bf > 1) {
      return balanceFactor(node.left) < 0 ? "LR" : "LL";
    }
    if (bf < -1) {
      return balanceFactor(node.right) > 0 ? "RL" : "RR";
    }
    return null;
  }

  function insertRec(parentId: number | null, isLeft: boolean, value: number): number {
    const newId = nextId++;
    const newNode: RawNode = {
      id: newId,
      value,
      left: null,
      right: null,
      parent: parentId,
      height: 1,
      balanceFactor: 0,
    };
    nodeMap.set(newId, newNode);

    if (parentId === null) {
      rootId = newId;
      refreshAllBalanceFactors();
      const states = new Map<number, TreeNodeState>([[newId, "inserted"]]);
      frames.push(buildFrame(nodeMap, rootId, states, comparisons, `Insert ${value} as root`));
      return newId;
    }

    const parent = nodeMap.get(parentId)!;
    if (isLeft) parent.left = newId;
    else parent.right = newId;

    refreshAllBalanceFactors();
    const insertStates = new Map<number, TreeNodeState>([[newId, "inserted"]]);
    frames.push(
      buildFrame(
        nodeMap,
        rootId,
        insertStates,
        comparisons,
        `Inserted ${value}`
      )
    );

    return newId;
  }

  function insert(value: number) {
    // Walk down and record comparisons
    if (rootId === null) {
      insertRec(null, false, value);
      return;
    }

    const pathIds: number[] = [];
    let curId = rootId;

    while (true) {
      const cur = nodeMap.get(curId)!;
      comparisons++;
      pathIds.push(curId);

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
          insertRec(curId, true, value);
          break;
        }
        curId = cur.left;
      } else {
        if (cur.right === null) {
          insertRec(curId, false, value);
          break;
        }
        curId = cur.right;
      }
    }

    // Walk back up and rebalance
    // Rebuild path from root to find insertion point ancestors
    const ancestors = [...pathIds].reverse();
    for (const ancId of ancestors) {
      const rotType = getRotationType(ancId);
      if (rotType) {
        refreshAllBalanceFactors();
        const preRotStates = new Map<number, TreeNodeState>([[ancId, "rotated"]]);
        frames.push(
          buildFrame(
            nodeMap,
            rootId,
            preRotStates,
            comparisons,
            `${rotType} rotation at node ${nodeMap.get(ancId)!.value}`
          )
        );

        const newTop = rebalance(ancId);
        if (ancId === rootId) rootId = newTop;

        refreshAllBalanceFactors();
        const postRotStates = new Map<number, TreeNodeState>([[newTop, "inserted"]]);
        frames.push(
          buildFrame(
            nodeMap,
            rootId,
            postRotStates,
            comparisons,
            `After ${rotType} rotation`
          )
        );
      } else {
        updateHeight(ancId);
      }
    }

    refreshAllBalanceFactors();
    frames.push(buildFrame(nodeMap, rootId, new Map(), comparisons));
  }

  for (const value of values) {
    insert(value);
  }

  refreshAllBalanceFactors();
  frames.push(
    buildFrame(nodeMap, rootId, new Map(), comparisons, "AVL tree construction complete")
  );

  return {
    frames,
    totalComparisons: comparisons,
    treeHeight: getTreeHeight(nodeMap, rootId),
  };
}
