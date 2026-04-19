import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Longest Common Subsequence (LCS) finds the longest sequence of characters that appears in both strings in the same relative order, but not necessarily contiguously. Unlike substring matching, subsequences can skip characters. LCS is a classic DP problem that demonstrates how to capture optimal substructure in a 2D table.

The cell (i, j) stores the length of the LCS of the first i characters of A and the first j characters of B. If the current characters match, the LCS extends by one from the diagonal. Otherwise, the best we can do is the larger of the LCS without A's current char or without B's current char.`,

    howItWorks: [
      "Create an (m+1) × (n+1) table initialized to 0 (base cases: empty string has LCS 0 with anything).",
      "For each cell (i, j): if A[i] == B[j], set dp[i][j] = dp[i-1][j-1] + 1.",
      "Otherwise, set dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
      "The length of the LCS is in the bottom-right cell.",
      "To reconstruct the actual subsequence, trace back through the table following the match decisions.",
    ],

    useCases: [
      "Diff tools — finding the minimal set of changes between two files.",
      "Version control — computing diffs in git and other VCS tools.",
      "Bioinformatics — comparing DNA or protein sequences for evolutionary analysis.",
      "Plagiarism detection — measuring content overlap between documents.",
      "Data synchronization — finding the common backbone between two diverged data sets.",
    ],

    complexity: {
      time: {
        best: { value: "O(m·n)", note: "Every cell must be computed even if all characters match." },
        average: { value: "O(m·n)", note: "Full table is always computed." },
        worst: { value: "O(m·n)", note: "Fully dissimilar strings of length m and n." },
      },
      space: { value: "O(m·n)", note: "Full table for reconstruction. Reducible to O(min(m,n)) if only length is needed." },
    },
  },

  code: {
    javascript: `function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,

    python: `def lcs(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,

    java: `int lcs(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i-1) == b.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[m][n];
}`,

    cpp: `int lcs(const std::string& a, const std::string& b) {
    int m = a.size(), n = b.size();
    std::vector<std::vector<int>> dp(m+1, std::vector<int>(n+1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else dp[i][j] = std::max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}`,
  },
};
