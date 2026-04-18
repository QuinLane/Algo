"use client";

import SearchPage from "@/components/layout/SearchPage";
import { linearSearch } from "@/lib/algorithms/searching/linearSearch";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "linear-search")!;

export default function Page() {
  return <SearchPage meta={meta} generateTrace={linearSearch} />;
}
