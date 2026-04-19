import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

export const info: AlgorithmInfoContent = {
  explanation: {
    overview: `Fibonacci with memoization is the canonical introduction to dynamic programming. The naive recursive approach recomputes the same subproblems exponentially — fib(40) makes over a billion calls. DP fixes this by storing each result in a table the moment it is computed, reducing the work to O(n) time and O(n) space.

The key insight is optimal substructure: the answer to a larger problem is built directly from smaller answers already in the table. This bottom-up approach fills the table from F(0) forward, guaranteeing each entry is ready before it is needed.`,

    howItWorks: [
      "Create a table of size n+1, initialized to null.",
      "Set base cases: F(0) = 0, F(1) = 1.",
      "For each i from 2 to n, read F(i-1) and F(i-2) from the table and write their sum to F(i).",
      "Return F(n) from the table.",
    ],

    useCases: [
      "Teaching dynamic programming — simplest possible example of overlapping subproblems.",
      "Generating Fibonacci sequences efficiently in applications such as generative art and musical rhythm.",
      "Memoization pattern used in compilers, parsers, and game AI where state evaluation overlaps.",
    ],

    complexity: {
      time: {
        best: { value: "O(n)", note: "Each of the n+1 cells is filled exactly once." },
        average: { value: "O(n)", note: "Single pass regardless of input." },
        worst: { value: "O(n)", note: "Linear in n — no degenerate cases." },
      },
      space: { value: "O(n)", note: "One table cell per Fibonacci number. Reducible to O(1) with two variables." },
    },
  },

  code: {
    javascript: `function fibonacci(n) {
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,

    python: `def fibonacci(n: int) -> int:
    dp = [0] * (n + 1)
    if n >= 1:
        dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,

    java: `int fibonacci(int n) {
    int[] dp = new int[n + 1];
    if (n >= 1) dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,

    cpp: `int fibonacci(int n) {
    std::vector<int> dp(n + 1, 0);
    if (n >= 1) dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
  },
};
