"use client";

import PathfindingPage from "@/components/layout/PathfindingPage";
import { aStar } from "@/lib/algorithms/pathfinding/astar";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "astar")!;

export default function Page() {
  return <PathfindingPage meta={meta} generateTrace={aStar} />;
}
