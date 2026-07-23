export function americanToDecimal(americanOdds: number): number {
  if (!Number.isFinite(americanOdds) || americanOdds === 0) {
    throw new Error("American odds must be a non-zero number.");
  }
  return americanOdds > 0 ? 1 + americanOdds / 100 : 1 + 100 / Math.abs(americanOdds);
}

export function profitForStake(stake: number, americanOdds: number): number {
  return stake * (americanToDecimal(americanOdds) - 1);
}

export function breakEvenPercent(americanOdds: number): number {
  return (1 / americanToDecimal(americanOdds)) * 100;
}

export function formatAmericanOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : String(odds);
}
