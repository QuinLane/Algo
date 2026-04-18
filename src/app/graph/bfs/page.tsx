"use client";

import GraphPage from "@/components/layout/GraphPage";
import { bfs } from "@/lib/algorithms/graph/bfs";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "bfs")!;

export default function Page() {
  return <GraphPage meta={meta} generateTrace={bfs} />;
}
