"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Sorting",
    href: "/sort",
    children: [
      { label: "Bubble Sort", href: "/sort/bubble" },
      { label: "Insertion Sort", href: "/sort/insertion" },
      { label: "Selection Sort", href: "/sort/selection" },
      { label: "Merge Sort", href: "/sort/merge" },
      { label: "Quick Sort", href: "/sort/quick" },
      { label: "Heap Sort", href: "/sort/heap" },
    ],
  },
  {
    label: "Searching",
    href: "/search",
    children: [
      { label: "Linear Search", href: "/search/linear" },
      { label: "Binary Search", href: "/search/binary" },
    ],
  },
  {
    label: "Graph",
    href: "/graph",
    children: [
      { label: "BFS", href: "/graph/bfs" },
      { label: "DFS", href: "/graph/dfs" },
      { label: "Dijkstra", href: "/graph/dijkstra" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] h-screen sticky top-0 overflow-y-auto p-4 flex flex-col gap-1">
      <p className="text-[var(--color-accent)] font-bold text-sm uppercase tracking-widest mb-4 px-2">
        Algo
      </p>
      {navItems.map((item) => (
        <div key={item.href}>
          <Link
            href={item.href}
            className={`block px-2 py-1.5 rounded text-sm transition-colors ${
              pathname === item.href
                ? "text-[var(--color-accent)] bg-[var(--color-border)]"
                : "text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-border)]"
            }`}
          >
            {item.label}
          </Link>
          {"children" in item &&
            item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={`block pl-5 pr-2 py-1 rounded text-xs transition-colors ${
                  pathname === child.href
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {child.label}
              </Link>
            ))}
        </div>
      ))}
    </nav>
  );
}
