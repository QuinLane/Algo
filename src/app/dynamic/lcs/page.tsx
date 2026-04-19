"use client";

import DPPage from "@/components/layout/DPPage";
import { computeLCS } from "@/lib/algorithms/dynamic/lcs";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "lcs")!;

export default function Page() {
  return (
    <DPPage
      meta={meta}
      mode="strings"
      defaultA="ABCBDAB"
      defaultB="BDCAB"
      generateTrace={computeLCS}
    />
  );
}
