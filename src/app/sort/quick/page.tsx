"use client";

import SortPage from "@/components/layout/SortPage";
import { quickSort } from "@/lib/algorithms/sorting/quickSort";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "quick-sort")!;

export default function Page() {
  return <SortPage meta={meta} generateTrace={quickSort} />;
}
