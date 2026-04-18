"use client";

import type { GraphFrame } from "@/types/algorithm";

const NODE_COLORS: Record<string, string> = {
  unvisited: "var(--color-bg-card)",
  visiting: "var(--color-bar-compared)",
  visited: "var(--color-bar-sorted)",
};

const NODE_BORDER: Record<string, string> = {
  unvisited: "var(--color-border)",
  visiting: "var(--color-bar-compared)",
  visited: "var(--color-bar-sorted)",
};

const EDGE_COLORS: Record<string, string> = {
  unvisited: "var(--color-border)",
  active: "var(--color-bar-compared)",
  visited: "var(--color-bar-sorted)",
};

interface Props {
  frame: GraphFrame | null;
  showDistances?: boolean;
}

export default function GraphVisualizer({ frame, showDistances = false }: Props) {
  if (!frame) {
    return (
      <div className="w-full h-80 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] text-sm">
        Press play to start
      </div>
    );
  }

  const { nodes, edges, queue, stack, distances } = frame;
  const r = 18;

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden">
        <svg viewBox="0 0 500 320" className="w-full h-80">
          {edges.map((e, i) => {
            const from = nodes.find((n) => n.id === e.from);
            const to = nodes.find((n) => n.id === e.to);
            if (!from || !to) return null;
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;
            return (
              <g key={i}>
                <line
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={EDGE_COLORS[e.state]}
                  strokeWidth={e.state === "active" ? 2.5 : 1.5}
                />
                {e.weight !== undefined && (
                  <text
                    x={mx} y={my - 4}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--color-text-muted)"
                  >
                    {e.weight}
                  </text>
                )}
              </g>
            );
          })}

          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y} r={r}
                fill={NODE_COLORS[node.state]}
                stroke={NODE_BORDER[node.state]}
                strokeWidth={node.state === "visiting" ? 2.5 : 1.5}
              />
              <text
                x={node.x} y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="bold"
                fill={node.state === "unvisited" ? "var(--color-text-muted)" : "#000"}
              >
                {node.id}
              </text>
              {showDistances && node.distance !== undefined && node.distance !== Infinity && (
                <text
                  x={node.x} y={node.y + r + 11}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--color-accent)"
                >
                  {node.distance}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="flex gap-4 flex-wrap">
        {queue && (
          <div className="flex-1 min-w-0 p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Queue</p>
            <p className="text-sm font-mono text-[var(--color-text-primary)]">
              {queue.length ? `[${queue.join(", ")}]` : "empty"}
            </p>
          </div>
        )}
        {stack && (
          <div className="flex-1 min-w-0 p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Stack</p>
            <p className="text-sm font-mono text-[var(--color-text-primary)]">
              {stack.length ? `[${stack.join(", ")}]` : "empty"}
            </p>
          </div>
        )}
        {distances && (
          <div className="flex-1 min-w-0 p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Distances</p>
            <p className="text-sm font-mono text-[var(--color-text-primary)] flex flex-wrap gap-2">
              {Object.entries(distances).map(([k, v]) => (
                <span key={k}>
                  <span className="text-[var(--color-accent)]">{k}</span>:{v === Infinity ? "∞" : v}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
