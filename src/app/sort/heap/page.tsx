"use client";

import SortPage from "@/components/layout/SortPage";
import { heapSort } from "@/lib/algorithms/sorting/heapSort";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "heap-sort")!;

export default function Page() {
  return <SortPage meta={meta} generateTrace={heapSort} />;
}
