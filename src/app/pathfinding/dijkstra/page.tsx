"use client";

import PathfindingPage from "@/components/layout/PathfindingPage";
import { dijkstraGrid } from "@/lib/algorithms/pathfinding/dijkstra-grid";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "dijkstra-grid")!;

export default function Page() {
  return <PathfindingPage meta={meta} generateTrace={dijkstraGrid} />;
}
