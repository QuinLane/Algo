"use client";

import GraphPage from "@/components/layout/GraphPage";
import { dfs } from "@/lib/algorithms/graph/dfs";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "dfs")!;

export default function Page() {
  return <GraphPage meta={meta} generateTrace={dfs} />;
}
