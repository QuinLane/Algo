"use client";

import GraphPage from "@/components/layout/GraphPage";
import { dijkstra } from "@/lib/algorithms/graph/dijkstra";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "dijkstra")!;

export default function Page() {
  return <GraphPage meta={meta} generateTrace={dijkstra} weighted />;
}
