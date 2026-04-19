"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import pkg from "../../../package.json";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
        <span className="text-[var(--color-accent)] font-bold text-sm uppercase tracking-widest">Algo</span>
        <button onClick={() => setOpen((v) => !v)} className="text-[var(--color-text-primary)] text-lg">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {open && (
        <div className="md:hidden fixed inset-0 z-10 bg-black/60" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed md:sticky top-0 z-20 h-screen overflow-y-auto p-4 flex flex-col gap-1
        w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]
        transition-transform md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <p className="text-[var(--color-accent)] font-bold text-sm uppercase tracking-widest mb-4 px-2 hidden md:block">
          Algo
        </p>
        <div className="mt-12 md:mt-0" />
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
            item.children?.map((child) => (
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
        <div className="mt-auto pt-6">
          <p className="px-2 text-[10px] text-[var(--color-text-muted)] font-mono">v{pkg.version}</p>
        </div>
      </nav>
    </>
  );
}
