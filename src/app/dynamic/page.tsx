import { dpAlgorithms } from "@/lib/registry";
import AlgorithmCard from "@/components/layout/AlgorithmCard";

export default function DynamicPage() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Dynamic Programming</h1>
      <p className="text-[var(--color-text-muted)] mb-10">
        Watch DP tables fill in step by step, with heatmap coloring and dependency highlights.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dpAlgorithms.map((algo) => (
          <AlgorithmCard key={algo.id} algo={algo} />
        ))}
      </div>
    </div>
  );
}
