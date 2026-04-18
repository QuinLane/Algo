"use client";

import SortPage from "@/components/layout/SortPage";
import { mergeSort } from "@/lib/algorithms/sorting/mergeSort";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "merge-sort")!;

export default function Page() {
  return <SortPage meta={meta} generateTrace={mergeSort} hasAuxiliary />;
}
