import { sortAlgorithms, searchAlgorithms, graphAlgorithms } from "@/lib/registry";
import AlgorithmCard from "@/components/layout/AlgorithmCard";

const sections = [
  { title: "Sorting", algorithms: sortAlgorithms },
  { title: "Searching", algorithms: searchAlgorithms },
  { title: "Graph", algorithms: graphAlgorithms },
];

export default function Home() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
        Algorithm Visualizer
      </h1>
      <p className="text-[var(--color-text-muted)] mb-10">
        Step through algorithms with animated visualizations and audio feedback.
      </p>
      {sections.map((section) => (
        <section key={section.title} className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-bold mb-4">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.algorithms.map((algo) => (
              <AlgorithmCard key={algo.id} algo={algo} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
