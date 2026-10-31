/** CSS optimizers may serialize 900ms as .9s. WAAPI always expects milliseconds. */
export function motionMilliseconds(value: string, fallback: number): number {
  const token = value.trim();
  const amount = Number.parseFloat(token);
  if (!Number.isFinite(amount) || amount < 0) return fallback;
  if (token.endsWith('ms')) return amount;
  if (token.endsWith('s')) return amount * 1000;
  return fallback;
}
