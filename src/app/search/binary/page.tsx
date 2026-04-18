"use client";

import SearchPage from "@/components/layout/SearchPage";
import { binarySearch } from "@/lib/algorithms/searching/binarySearch";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "binary-search")!;

export default function Page() {
  return <SearchPage meta={meta} generateTrace={binarySearch} />;
}
