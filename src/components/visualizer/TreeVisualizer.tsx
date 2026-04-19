"use client";

import type { TreeFrame } from "@/types/algorithm";

const NODE_RADIUS = 20;

const NODE_FILL: Record<string, string> = {
  default: "var(--color-bg-card)",
  active: "var(--color-accent)",
  path: "#0e4f6e",
  inserted: "#22c55e",
  rotated: "#a855f7",
  found: "#22c55e",
  highlighted: "#f59e0b",
};

const NODE_STROKE: Record<string, string> = {
  default: "var(--color-border)",
  active: "var(--color-accent)",
  path: "#0891b2",
  inserted: "#16a34a",
  rotated: "#9333ea",
  found: "#16a34a",
  highlighted: "#d97706",
};

const NODE_TEXT: Record<string, string> = {
  default: "var(--color-text-primary)",
  active: "#030712",
  path: "#e2e8f0",
  inserted: "#030712",
  rotated: "#ffffff",
  found: "#030712",
  highlighted: "#030712",
};

interface Props {
  frame: TreeFrame | null;
}

export default function TreeVisualizer({ frame }: Props) {
  if (!frame || frame.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <p className="text-[var(--color-text-muted)] text-sm font-mono">
          Enter values and press Build
        </p>
      </div>
    );
  }

  const { nodes } = frame;

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs) - NODE_RADIUS - 24;
  const maxX = Math.max(...xs) + NODE_RADIUS + 24;
  const maxY = Math.max(...ys) + NODE_RADIUS + 24;
  const vbWidth = Math.max(maxX - minX, 160);
  const vbHeight = Math.max(maxY, 80);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-x-auto">
      <svg
        viewBox={`${minX} 0 ${vbWidth} ${vbHeight}`}
        width="100%"
        style={{ minHeight: "180px", maxHeight: "420px" }}
        className="block"
      >
        {/* Edges */}
        {nodes.flatMap((node) => {
          const lines = [];
          if (node.leftId !== null) {
            const child = nodeMap.get(node.leftId);
            if (child) {
              lines.push(
                <line
                  key={`e-${node.id}-l`}
                  x1={node.x}
                  y1={node.y}
                  x2={child.x}
                  y2={child.y}
                  stroke="var(--color-border)"
                  strokeWidth={1.5}
                />
              );
            }
          }
          if (node.rightId !== null) {
            const child = nodeMap.get(node.rightId);
            if (child) {
              lines.push(
                <line
                  key={`e-${node.id}-r`}
                  x1={node.x}
                  y1={node.y}
                  x2={child.x}
                  y2={child.y}
                  stroke="var(--color-border)"
                  strokeWidth={1.5}
                />
              );
            }
          }
          return lines;
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <circle
              r={NODE_RADIUS}
              fill={NODE_FILL[node.state] ?? NODE_FILL.default}
              stroke={NODE_STROKE[node.state] ?? NODE_STROKE.default}
              strokeWidth={node.state === "default" ? 1.5 : 2.5}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={node.value > 99 ? "10" : "12"}
              fontWeight="600"
              fontFamily="monospace"
              fill={NODE_TEXT[node.state] ?? NODE_TEXT.default}
            >
              {node.value}
            </text>
            {node.balanceFactor !== undefined && (
              <text
                textAnchor="middle"
                dominantBaseline="central"
                y={-NODE_RADIUS - 9}
                fontSize="9"
                fontFamily="monospace"
                fill={Math.abs(node.balanceFactor) > 1 ? "#ef4444" : "var(--color-text-muted)"}
              >
                {node.balanceFactor > 0 ? `+${node.balanceFactor}` : node.balanceFactor}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
