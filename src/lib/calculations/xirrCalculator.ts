import { differenceInDays } from "date-fns";

interface CashFlow {
  amount: number;
  date: Date;
}

const calculateNPV = (rate: number, cashFlows: CashFlow[]) => {
  if (cashFlows.length === 0) return 0;
  const startDate = cashFlows[0].date;
  return cashFlows.reduce((acc, flow) => {
    const days = differenceInDays(flow.date, startDate);
    return acc + flow.amount / Math.pow(1 + rate, days / 365);
  }, 0);
};

const calculateNPVDerivative = (rate: number, cashFlows: CashFlow[]) => {
  if (cashFlows.length === 0) return 0;
  const startDate = cashFlows[0].date;
  return cashFlows.reduce((acc, flow) => {
    const days = differenceInDays(flow.date, startDate);
    const t = days / 365;
    if (t === 0) return acc;
    return acc - t * flow.amount * Math.pow(1 + rate, -(t + 1));
  }, 0);
};

/**
 * Calculates the Extended Internal Rate of Return (XIRR).
 * @param cashFlows Array of cash flows with amount and date.
 * @param guess Initial guess for the rate (default 0.1 or 10%).
 * @returns The XIRR as a decimal (e.g., 0.15 for 15%).
 */
export const calculateXIRR = (cashFlows: CashFlow[], guess: number = 0.1): number => {
  if (cashFlows.length < 2) return 0;

  // Sort cash flows by date
  const sortedFlows = [...cashFlows].sort((a, b) => a.date.getTime() - b.date.getTime());

  let rate = guess;
  const maxIterations = 100;
  const tolerance = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(rate, sortedFlows);
    const derivative = calculateNPVDerivative(rate, sortedFlows);

    if (Math.abs(derivative) < 1e-10) break;

    const newRate = rate - npv / derivative;
    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }
    rate = newRate;
  }

  return rate;
};
