export function generateArray(n: number): number[] {
  return Array.from({ length: n }, (_, i) => Math.floor(((i + 1) / n) * 100));
}

export function shuffleArray(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
