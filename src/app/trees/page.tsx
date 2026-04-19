import { treeAlgorithms } from "@/lib/registry";
import AlgorithmCard from "@/components/layout/AlgorithmCard";

export default function TreesPage() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Trees</h1>
      <p className="text-[var(--color-text-muted)] mb-10">
        Step through tree construction and traversal with an interactive SVG visualizer.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {treeAlgorithms.map((algo) => (
          <AlgorithmCard key={algo.id} algo={algo} />
        ))}
      </div>
    </div>
  );
}
