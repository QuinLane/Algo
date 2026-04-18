"use client";

import SortPage from "@/components/layout/SortPage";
import { bubbleSort } from "@/lib/algorithms/sorting/bubble";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "bubble-sort")!;

export default function Page() {
  return <SortPage meta={meta} generateTrace={bubbleSort} />;
}
