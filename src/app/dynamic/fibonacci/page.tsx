"use client";

import DPPage from "@/components/layout/DPPage";
import { computeFibonacci } from "@/lib/algorithms/dynamic/fibonacci";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "fibonacci-dp")!;

export default function Page() {
  return (
    <DPPage
      meta={meta}
      mode="number"
      defaultN={10}
      maxN={20}
      generateTrace={computeFibonacci}
    />
  );
}
