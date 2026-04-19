"use client";

import { useState } from "react";
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
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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

          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: "default" }}
              >
                <circle
                  cx={node.x} cy={node.y} r={isHovered ? r + 2 : r}
                  fill={isHovered ? "var(--color-accent)" : NODE_COLORS[node.state]}
                  stroke={isHovered ? "var(--color-accent)" : NODE_BORDER[node.state]}
                  strokeWidth={isHovered ? 2.5 : node.state === "visiting" ? 2.5 : 1.5}
                  style={{ transition: "r 0.1s ease, fill 0.1s ease" }}
                />
                <text
                  x={node.x} y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={isHovered || node.state !== "unvisited" ? "#000" : "var(--color-text-muted)"}
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
                {isHovered && (
                  <g>
                    <rect
                      x={node.x + r + 4} y={node.y - 11}
                      width={58} height={16}
                      rx={3}
                      fill="var(--color-bg-card)"
                      stroke="var(--color-border)"
                      strokeWidth={0.5}
                    />
                    <text
                      x={node.x + r + 33} y={node.y - 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="8"
                      fill="var(--color-text-primary)"
                    >
                      {node.id}: {node.state}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
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
