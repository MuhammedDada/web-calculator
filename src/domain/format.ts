const SIGNIFICANT_DIGITS = 10;

export function formatResult(value: number): string {
  const rounded = Number(value.toPrecision(SIGNIFICANT_DIGITS));
  return String(rounded);
}
