"use client";

import TreePage from "@/components/layout/TreePage";
import { treeTraversals } from "@/lib/algorithms/trees/traversals";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "tree-traversals")!;

export default function Page() {
  return <TreePage meta={meta} showTraversalSelector generateTrace={treeTraversals} />;
}
