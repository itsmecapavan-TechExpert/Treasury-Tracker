import prisma from "@/lib/prisma";
import { calculateAccruedInterest } from "@/lib/calculations/interestCalculator";

export interface PortfolioStats {
  totalCost: number;
  currentValue: number;
  accruedIncome: number;
  realizedIncome: number;
  unrealizedGains: number;
  allocation: {
    name: string;
    value: number;
    color: string;
  }[];
}

export async function getPortfolioStats(): Promise<PortfolioStats> {
  const [debentures, mutualFunds, fixedDeposits] = await Promise.all([
    prisma.debenture.findMany({ include: { transactions: true } }),
    prisma.mutualFund.findMany({ include: { transactions: true } }),
    prisma.fixedDeposit.findMany(),
  ]);

  let totalCost = 0;
  let currentValue = 0;
  let accruedIncome = 0;
  let realizedIncome = 0;

  // Debentures
  debentures.forEach((d) => {
    totalCost += d.purchaseValue;
    // Current value for debentures is often principal + accrued
    const accrued = calculateAccruedInterest(
      d.faceValue,
      d.interestRate,
      d.lastInterestDate || d.purchaseDate
    );
    accruedIncome += accrued;
    currentValue += d.faceValue + accrued;

    d.transactions.forEach((t) => {
      if (t.type === "INTEREST") realizedIncome += t.amount;
    });
  });

  // Mutual Funds
  mutualFunds.forEach((f) => {
    let units = 0;
    let cost = 0;
    f.transactions.forEach((t) => {
      if (t.type === "BUY") {
        units += t.units;
        cost += t.units * t.NAV;
      } else {
        units -= t.units;
        // Simplified: realized gain/loss logic could be here
      }
    });
    totalCost += cost;
    // Current value would need current NAV (mocked for now or fetched)
    const mockCurrentNAV = 120; // Example
    currentValue += units * mockCurrentNAV;
  });

  // Fixed Deposits
  fixedDeposits.forEach((fd) => {
    totalCost += fd.principal;
    const accrued = calculateAccruedInterest(
      fd.principal,
      fd.interestRate,
      fd.startDate
    );
    accruedIncome += accrued;
    currentValue += fd.principal + accrued;
  });

  const unrealizedGains = currentValue - totalCost;

  const allocation = [
    { name: "Debentures", value: debentures.length, color: "#10b981" },
    { name: "Mutual Funds", value: mutualFunds.length, color: "#3b82f6" },
    { name: "Fixed Deposits", value: fixedDeposits.length, color: "#f59e0b" },
  ].filter(a => a.value > 0);

  return {
    totalCost,
    currentValue,
    accruedIncome,
    realizedIncome,
    unrealizedGains,
    allocation,
  };
}
