"use client";

import TreePage from "@/components/layout/TreePage";
import { buildAVL } from "@/lib/algorithms/trees/avl";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "avl")!;

export default function Page() {
  return <TreePage meta={meta} generateTrace={buildAVL} />;
}
