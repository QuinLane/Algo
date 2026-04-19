"use client";

import DPPage from "@/components/layout/DPPage";
import { computeEditDistance } from "@/lib/algorithms/dynamic/edit-distance";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "edit-distance")!;

export default function Page() {
  return (
    <DPPage
      meta={meta}
      mode="strings"
      defaultA="KITTEN"
      defaultB="SITTING"
      generateTrace={computeEditDistance}
    />
  );
}
