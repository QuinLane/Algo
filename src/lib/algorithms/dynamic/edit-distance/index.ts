import type { DPTrace, DPCell, DPFrame, DPCellState } from "@/types/algorithm";

function snapshot(
  dp: (number | null)[][],
  fills: number,
  activeRow: number | null,
  activeCol: number | null,
  depCells: Array<[number, number]>,
  message?: string
): DPFrame {
  const table: DPCell[][] = dp.map((row, r) =>
    row.map((v, c) => {
      let state: DPCellState = v !== null ? "filled" : "default";
      if (r === activeRow && c === activeCol) state = "active";
      else if (depCells.some(([dr, dc]) => dr === r && dc === c)) state = "dependency";
      return { value: v, state };
    })
  );
  return { table, fills, message, depCells };
}

export function computeEditDistance(a: string, b: string): DPTrace {
  const safeA = a.slice(0, 12);
  const safeB = b.slice(0, 12);
  const m = safeA.length;
  const n = safeB.length;
  const frames: DPFrame[] = [];

  const dp: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(null)
  );
  let fills = 0;

  frames.push(snapshot(dp, fills, null, null, [], `Edit distance: "${safeA}" → "${safeB}"`));

  // Fill row 0
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
    fills++;
    frames.push(snapshot(dp, fills, 0, j, [], j === 0 ? "Base case: empty string needs 0 edits" : `Base case: insert ${j} chars`));
  }

  // Fill col 0
  for (let i = 1; i <= m; i++) {
    dp[i][0] = i;
    fills++;
    frames.push(snapshot(dp, fills, i, 0, [], `Base case: delete ${i} chars`));
  }

  // Fill rest
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const deps: Array<[number, number]> = [[i - 1, j], [i, j - 1], [i - 1, j - 1]];
      frames.push(snapshot(dp, fills, i, j, deps, `Compare '${safeA[i - 1]}' vs '${safeB[j - 1]}'`));

      const cost = safeA[i - 1] === safeB[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j]! + 1, dp[i][j - 1]! + 1, dp[i - 1][j - 1]! + cost);
      fills++;

      const opLabel = cost === 0 ? "match — copy diagonal" : `min(delete, insert, replace) = ${dp[i][j]}`;
      frames.push(snapshot(dp, fills, i, j, [], opLabel));
    }
  }

  // Mark result
  const finalTable: DPCell[][] = dp.map((row, r) =>
    row.map((v, c) => ({
      value: v,
      state: (r === m && c === n ? "result" : "filled") as DPCellState,
    }))
  );
  frames.push({ table: finalTable, fills, message: `Edit distance = ${dp[m][n]}` });

  return {
    frames,
    totalFills: fills,
    result: dp[m][n] ?? 0,
    mode: "2d",
    rowHeaders: ["", ...safeA.split("")],
    colHeaders: ["", ...safeB.split("")],
  };
}
