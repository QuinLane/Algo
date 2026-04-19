"use client";

import TreePage from "@/components/layout/TreePage";
import { buildBST } from "@/lib/algorithms/trees/bst";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "bst")!;

export default function Page() {
  return <TreePage meta={meta} generateTrace={buildBST} />;
}
