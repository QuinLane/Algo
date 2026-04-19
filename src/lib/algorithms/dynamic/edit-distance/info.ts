import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Edit Distance (Levenshtein Distance) measures the minimum number of single-character operations — insertions, deletions, and substitutions — needed to transform one string into another. It is a foundational algorithm in computational linguistics and bioinformatics, underpinning spell checkers, diff tools, DNA sequence alignment, and fuzzy search.

The DP table encodes all subproblem answers. Cell (i, j) holds the edit distance between the first i characters of string A and the first j characters of string B. Each cell is computed from three neighbors: the cell above (delete), the cell to the left (insert), and the diagonal cell (substitute or match).`,

    howItWorks: [
      "Create an (m+1) × (n+1) table where m and n are the string lengths.",
      "Fill row 0 with 0, 1, 2, …, n (transforming empty string into each prefix of B by inserting).",
      "Fill column 0 with 0, 1, 2, …, m (transforming each prefix of A into empty string by deleting).",
      "For each cell (i, j): if A[i] == B[j], copy the diagonal (no cost); otherwise take min(above+1, left+1, diagonal+1).",
      "The answer is in the bottom-right cell.",
    ],

    useCases: [
      "Spell checkers — find the closest dictionary word to a misspelled input.",
      "DNA alignment — measure similarity between gene sequences.",
      "Diff tools — git diff uses edit-distance variants to show minimal change sets.",
      "Fuzzy search — rank search results by edit distance to the query.",
      "Natural language processing — sentence similarity and translation evaluation metrics.",
    ],

    complexity: {
      time: {
        best: { value: "O(m·n)", note: "Every cell must be computed once." },
        average: { value: "O(m·n)", note: "No shortcuts — full table is always filled." },
        worst: { value: "O(m·n)", note: "Fully dissimilar strings of length m and n." },
      },
      space: { value: "O(m·n)", note: "Full table stored. Reducible to O(min(m,n)) with rolling rows." },
    },
  },

  code: {
    javascript: `function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost);
    }
  }
  return dp[m][n];
}`,

    python: `def edit_distance(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if a[i-1] == b[j-1] else 1
            dp[i][j] = min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost)
    return dp[m][n]`,

    java: `int editDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            int cost = a.charAt(i-1) == b.charAt(j-1) ? 0 : 1;
            dp[i][j] = Math.min(Math.min(dp[i-1][j]+1, dp[i][j-1]+1), dp[i-1][j-1]+cost);
        }
    }
    return dp[m][n];
}`,

    cpp: `int editDistance(const std::string& a, const std::string& b) {
    int m = a.size(), n = b.size();
    std::vector<std::vector<int>> dp(m+1, std::vector<int>(n+1));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            int cost = a[i-1] == b[j-1] ? 0 : 1;
            dp[i][j] = std::min({dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost});
        }
    }
    return dp[m][n];
}`,
  },
};
