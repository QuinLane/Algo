import type { DPTrace, DPCell, DPFrame, DPCellState } from "@/types/algorithm";

function snapshot(table: (number | null)[], fills: number, activeCol: number | null, depCols: number[], message?: string): DPFrame {
  const row: DPCell[] = table.map((v, i) => {
    let state: DPCellState = v !== null ? "filled" : "default";
    if (i === activeCol) state = "active";
    else if (depCols.includes(i)) state = "dependency";
    return { value: v, state };
  });
  return { table: [row], fills, message, depCells: depCols.map((c) => [0, c] as [number, number]) };
}

export function computeFibonacci(n: number): DPTrace {
  const safeN = Math.max(1, Math.min(n, 20));
  const frames: DPFrame[] = [];
  const table: (number | null)[] = new Array(safeN + 1).fill(null);
  let fills = 0;

  frames.push(snapshot(table, fills, null, [], `Initialize table for F(0)…F(${safeN})`));

  table[0] = 0;
  fills++;
  frames.push(snapshot(table, fills, 0, [], "Base case: F(0) = 0"));

  if (safeN >= 1) {
    table[1] = 1;
    fills++;
    frames.push(snapshot(table, fills, 1, [], "Base case: F(1) = 1"));
  }

  for (let i = 2; i <= safeN; i++) {
    frames.push(snapshot(table, fills, i, [i - 1, i - 2], `F(${i}) depends on F(${i - 1}) and F(${i - 2})`));
    table[i] = table[i - 1]! + table[i - 2]!;
    fills++;
    frames.push(snapshot(table, fills, i, [], `F(${i}) = ${table[i - 1]} + ${table[i - 2]} = ${table[i]}`));
  }

  // Mark result cell
  const finalRow: DPCell[] = table.map((v, i) => ({
    value: v,
    state: i === safeN ? "result" : "filled",
  }));
  frames.push({ table: [finalRow], fills, message: `Done — F(${safeN}) = ${table[safeN]}` });

  return {
    frames,
    totalFills: fills,
    result: table[safeN] ?? 0,
    mode: "1d",
    colHeaders: Array.from({ length: safeN + 1 }, (_, i) => String(i)),
  };
}
