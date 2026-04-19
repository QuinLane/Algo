"use client";

import type { DPFrame, DPTrace } from "@/types/algorithm";

const CELL = 38;
const HEADER = 34;
const PAD = 8;
const ARROW_HEAD = 5;

const CELL_FILL: Record<string, string> = {
  default: "var(--color-bg-card)",
  active: "var(--color-accent)",
  filled: "var(--color-bg-card)",
  dependency: "#0e4f6e",
  result: "#22c55e",
};

const CELL_STROKE: Record<string, string> = {
  default: "var(--color-border)",
  active: "var(--color-accent)",
  filled: "var(--color-border)",
  dependency: "#0891b2",
  result: "#16a34a",
};

const CELL_TEXT: Record<string, string> = {
  default: "var(--color-text-muted)",
  active: "#030712",
  filled: "var(--color-text-primary)",
  dependency: "#e2e8f0",
  result: "#030712",
};

function heatColor(value: number, maxVal: number): string {
  if (maxVal <= 0) return "transparent";
  const t = Math.min(value / maxVal, 1);
  // cyan (#06b6d4) at 0 → orange (#f97316) at 0.5 → red (#ef4444) at 1
  const r = Math.round(t < 0.5 ? 6 + (249 - 6) * (t * 2) : 249 + (239 - 249) * ((t - 0.5) * 2));
  const g = Math.round(t < 0.5 ? 182 + (115 - 182) * (t * 2) : 115 + (68 - 115) * ((t - 0.5) * 2));
  const b = Math.round(t < 0.5 ? 212 + (22 - 212) * (t * 2) : 22 + (68 - 22) * ((t - 0.5) * 2));
  return `rgba(${r},${g},${b},0.25)`;
}

interface Props {
  frame: DPFrame | null;
  trace: DPTrace | null;
}

export default function DPTableVisualizer({ frame, trace }: Props) {
  if (!frame || !trace) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
        style={{ height: "200px" }}
      >
        <p className="text-[var(--color-text-muted)] text-sm font-mono">
          {trace?.mode === "2d" ? "Enter strings and press Run" : "Set n and press Run"}
        </p>
      </div>
    );
  }

  const { table, depCells = [] } = frame;
  const rows = table.length;
  const cols = table[0]?.length ?? 0;
  const rowHeaders = trace.rowHeaders ?? [];
  const colHeaders = trace.colHeaders ?? [];
  const hasRowHeaders = rowHeaders.length > 0;
  const hasColHeaders = colHeaders.length > 0;

  const offsetX = hasRowHeaders ? HEADER : PAD;
  const offsetY = hasColHeaders ? HEADER : PAD;
  const vbWidth = offsetX + cols * CELL + PAD;
  const vbHeight = offsetY + rows * CELL + PAD;

  // Compute max filled value for heatmap
  let maxVal = 0;
  for (const row of table) {
    for (const cell of row) {
      if (cell.value !== null && cell.value > maxVal) maxVal = cell.value;
    }
  }

  const cellCx = (c: number) => offsetX + c * CELL + CELL / 2;
  const cellCy = (r: number) => offsetY + r * CELL + CELL / 2;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-auto">
      <svg
        viewBox={`0 0 ${vbWidth} ${vbHeight}`}
        width="100%"
        style={{ display: "block", maxHeight: "480px", minWidth: `${Math.min(vbWidth, 600)}px` }}
      >
        <defs>
          <marker id="arrowhead" markerWidth={ARROW_HEAD * 2} markerHeight={ARROW_HEAD * 2} refX={ARROW_HEAD} refY={ARROW_HEAD} orient="auto">
            <polygon
              points={`0 0, ${ARROW_HEAD * 2} ${ARROW_HEAD}, 0 ${ARROW_HEAD * 2}`}
              fill="#0891b2"
              opacity={0.7}
            />
          </marker>
        </defs>

        {/* Column headers */}
        {hasColHeaders &&
          colHeaders.map((h, c) => (
            <text
              key={`ch-${c}`}
              x={offsetX + c * CELL + CELL / 2}
              y={HEADER / 2 + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="600"
              fill={c === 0 ? "var(--color-text-muted)" : "var(--color-accent)"}
            >
              {h}
            </text>
          ))}

        {/* Row headers */}
        {hasRowHeaders &&
          rowHeaders.map((h, r) => (
            <text
              key={`rh-${r}`}
              x={HEADER / 2}
              y={offsetY + r * CELL + CELL / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="600"
              fill={r === 0 ? "var(--color-text-muted)" : "var(--color-accent)"}
            >
              {h}
            </text>
          ))}

        {/* Cells */}
        {table.map((row, r) =>
          row.map((cell, c) => {
            const x = offsetX + c * CELL;
            const y = offsetY + r * CELL;
            const fill = CELL_FILL[cell.state] ?? CELL_FILL.default;
            const stroke = CELL_STROKE[cell.state] ?? CELL_STROKE.default;
            const textFill = CELL_TEXT[cell.state] ?? CELL_TEXT.default;
            const heat = cell.state === "filled" && cell.value !== null && maxVal > 0
              ? heatColor(cell.value, maxVal)
              : null;

            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={x + 1}
                  y={y + 1}
                  width={CELL - 2}
                  height={CELL - 2}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={cell.state === "default" || cell.state === "filled" ? 1 : 2}
                  rx={3}
                />
                {heat && (
                  <rect
                    x={x + 1}
                    y={y + 1}
                    width={CELL - 2}
                    height={CELL - 2}
                    fill={heat}
                    rx={3}
                    style={{ pointerEvents: "none" }}
                  />
                )}
                {cell.value !== null && (
                  <text
                    x={x + CELL / 2}
                    y={y + CELL / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={cell.value > 99 ? "9" : "11"}
                    fontFamily="monospace"
                    fontWeight="600"
                    fill={textFill}
                  >
                    {cell.value}
                  </text>
                )}
              </g>
            );
          })
        )}

        {/* Dependency arrows */}
        {depCells.map(([dr, dc], i) => {
          // Find active cell
          let ar = -1, ac = -1;
          outer: for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (table[r][c].state === "active") { ar = r; ac = c; break outer; }
            }
          }
          if (ar < 0) return null;

          const x1 = cellCx(dc);
          const y1 = cellCy(dr);
          const x2 = cellCx(ac);
          const y2 = cellCy(ar);

          // Shorten line so arrowhead sits at cell edge
          const dx = x2 - x1;
          const dy = y2 - y1;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) return null;
          const shrink = (CELL / 2 - 4) / dist;
          const ex = x2 - dx * shrink;
          const ey = y2 - dy * shrink;

          return (
            <line
              key={i}
              x1={x1} y1={y1}
              x2={ex} y2={ey}
              stroke="#0891b2"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              opacity={0.7}
              markerEnd="url(#arrowhead)"
            />
          );
        })}
      </svg>
    </div>
  );
}
