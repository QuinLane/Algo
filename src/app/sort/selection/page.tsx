import SortPage from "@/components/layout/SortPage";
import { selectionSort } from "@/lib/algorithms/sorting/selectionSort";
import { registry } from "@/lib/registry";

const meta = registry.find((a) => a.id === "selection-sort")!;

export default function Page() {
  return <SortPage meta={meta} generateTrace={selectionSort} />;
}
