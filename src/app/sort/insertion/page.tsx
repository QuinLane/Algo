import SortPage from "@/components/layout/SortPage";
import { insertionSort } from "@/lib/algorithms/sorting/insertionSort";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "insertion-sort")!;

export default function Page() {
  return <SortPage meta={meta} generateTrace={insertionSort} />;
}
