export function valueToHsl(value: number, max: number): string {
  const pct = value / max;
  const hue = Math.round(pct * 240); // 0=red, 120=green, 240=blue
  return `hsl(${hue}, 80%, 55%)`;
}
