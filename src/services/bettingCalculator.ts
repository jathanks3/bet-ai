import { americanToDecimal, breakEvenPercent, profitForStake } from "./oddsMath";

export type ProjectionPeriod = "daily" | "weekly" | "monthly" | "yearly";
export type ProjectionScenario = "expected" | "all_wins" | "break_even";

export interface ProjectionInput {
  wagerAmount: number;
  americanOdds: number;
  expectedWinPercent: number;
  numberOfBets: number;
  period: ProjectionPeriod;
  startingBankroll?: number;
  compound?: boolean;
  scenario?: ProjectionScenario;
}

export interface ProjectionResult {
  profitPerWin: number;
  lossPerLoss: number;
  breakEvenPercent: number;
  expectedWins: number;
  expectedLosses: number;
  totalWagered: number;
  expectedProfit: number;
  expectedRoiPercent: number;
  endingBankroll?: number;
  weeklyProfit: number;
  monthlyProfit: number;
  yearlyProfit: number;
}

const PERIODS_PER_YEAR: Record<ProjectionPeriod, number> = {
  daily: 365,
  weekly: 52,
  monthly: 12,
  yearly: 1,
};

export function calculateProjection(input: ProjectionInput): ProjectionResult {
  const { wagerAmount, americanOdds, numberOfBets, period } = input;
  if (wagerAmount <= 0 || numberOfBets <= 0 || !Number.isFinite(numberOfBets)) {
    throw new Error("Wager amount and number of bets must be greater than zero.");
  }
  if (input.expectedWinPercent < 0 || input.expectedWinPercent > 100) {
    throw new Error("Expected win percentage must be between 0 and 100.");
  }
  americanToDecimal(americanOdds);

  const breakEven = breakEvenPercent(americanOdds);
  const scenario = input.scenario ?? "expected";
  const winRate =
    scenario === "all_wins" ? 1 : scenario === "break_even" ? breakEven / 100 : input.expectedWinPercent / 100;
  const expectedWins = numberOfBets * winRate;
  const expectedLosses = numberOfBets - expectedWins;
  const profitPerWin = profitForStake(wagerAmount, americanOdds);
  const totalWagered = wagerAmount * numberOfBets;
  const simpleProfit = expectedWins * profitPerWin - expectedLosses * wagerAmount;

  let expectedProfit = simpleProfit;
  let endingBankroll = input.startingBankroll;
  if (input.compound && input.startingBankroll !== undefined) {
    const returnPerBet = winRate * (profitPerWin / wagerAmount) - (1 - winRate);
    endingBankroll = input.startingBankroll * Math.pow(1 + returnPerBet, numberOfBets);
    expectedProfit = endingBankroll - input.startingBankroll;
  } else if (endingBankroll !== undefined) {
    endingBankroll += expectedProfit;
  }

  const yearlyProfit = expectedProfit * PERIODS_PER_YEAR[period];
  return {
    profitPerWin,
    lossPerLoss: wagerAmount,
    breakEvenPercent: breakEven,
    expectedWins,
    expectedLosses,
    totalWagered,
    expectedProfit,
    expectedRoiPercent: totalWagered ? (expectedProfit / totalWagered) * 100 : 0,
    endingBankroll,
    weeklyProfit: yearlyProfit / 52,
    monthlyProfit: yearlyProfit / 12,
    yearlyProfit,
  };
}
