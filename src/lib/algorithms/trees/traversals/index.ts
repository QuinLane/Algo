import type { TreeTrace, TreeNodeState } from "@/types/algorithm";
import { buildFrame, getTreeHeight, type RawNode } from "@/lib/utils/treeUtils";
import type { TraversalType } from "@/components/layout/TreePage";

function buildSilentBST(values: number[]): {
  nodeMap: Map<number, RawNode>;
  rootId: number | null;
} {
  const nodeMap = new Map<number, RawNode>();
  let rootId: number | null = null;
  let nextId = 0;

  for (const value of values) {
    const newId = nextId++;
    const newNode: RawNode = { id: newId, value, left: null, right: null, parent: null, height: 1 };
    nodeMap.set(newId, newNode);

    if (rootId === null) {
      rootId = newId;
      continue;
    }

    let curId = rootId;
    while (true) {
      const cur = nodeMap.get(curId)!;
      if (value < cur.value) {
        if (cur.left === null) { cur.left = newId; newNode.parent = curId; break; }
        curId = cur.left;
      } else {
        if (cur.right === null) { cur.right = newId; newNode.parent = curId; break; }
        curId = cur.right;
      }
    }
  }

  return { nodeMap, rootId };
}

export function treeTraversals(
  values: number[],
  traversalType: TraversalType = "inorder"
): TreeTrace {
  const { nodeMap, rootId } = buildSilentBST(values);
  const frames = [];
  const outputList: number[] = [];
  let comparisons = 0;

  // Initial frame: full tree, all default
  frames.push(buildFrame(nodeMap, rootId, new Map(), 0, "Tree built — starting traversal", []));

  function inorder(id: number | null) {
    if (id === null) return;
    const node = nodeMap.get(id)!;
    inorder(node.left);

    comparisons++;
    const states = new Map<number, TreeNodeState>([[id, "active"]]);
    frames.push(
      buildFrame(nodeMap, rootId, states, comparisons, `Visit ${node.value}`, [...outputList])
    );
    outputList.push(node.value);
    const highlightStates = new Map<number, TreeNodeState>([[id, "highlighted"]]);
    frames.push(
      buildFrame(nodeMap, rootId, highlightStates, comparisons, `Output: ${node.value}`, [...outputList])
    );

    inorder(node.right);
  }

  function preorder(id: number | null) {
    if (id === null) return;
    const node = nodeMap.get(id)!;

    comparisons++;
    const states = new Map<number, TreeNodeState>([[id, "active"]]);
    frames.push(
      buildFrame(nodeMap, rootId, states, comparisons, `Visit ${node.value}`, [...outputList])
    );
    outputList.push(node.value);
    const highlightStates = new Map<number, TreeNodeState>([[id, "highlighted"]]);
    frames.push(
      buildFrame(nodeMap, rootId, highlightStates, comparisons, `Output: ${node.value}`, [...outputList])
    );

    preorder(node.left);
    preorder(node.right);
  }

  function postorder(id: number | null) {
    if (id === null) return;
    const node = nodeMap.get(id)!;

    postorder(node.left);
    postorder(node.right);

    comparisons++;
    const states = new Map<number, TreeNodeState>([[id, "active"]]);
    frames.push(
      buildFrame(nodeMap, rootId, states, comparisons, `Visit ${node.value}`, [...outputList])
    );
    outputList.push(node.value);
    const highlightStates = new Map<number, TreeNodeState>([[id, "highlighted"]]);
    frames.push(
      buildFrame(nodeMap, rootId, highlightStates, comparisons, `Output: ${node.value}`, [...outputList])
    );
  }

  if (traversalType === "inorder") inorder(rootId);
  else if (traversalType === "preorder") preorder(rootId);
  else postorder(rootId);

  frames.push(
    buildFrame(
      nodeMap,
      rootId,
      new Map(),
      comparisons,
      `Traversal complete — ${outputList.length} nodes visited`,
      [...outputList]
    )
  );

  return {
    frames,
    totalComparisons: comparisons,
    treeHeight: getTreeHeight(nodeMap, rootId),
  };
}
