import { Debenture, FixedDeposit } from "@prisma/client";
import { calculateAccruedInterest } from "./interestCalculator";
import { startOfMonth, endOfMonth, isAfter, isBefore } from "date-fns";

export interface AccrualEntry {
  investmentId: string;
  type: 'DEBENTURE' | 'FD';
  amount: number;
  date: Date;
}

/**
 * Processes monthly accruals for all active debentures and fixed deposits.
 * This engine calculates how much interest has been earned but not yet received.
 */
export const processMonthlyAccruals = (
  debentures: Debenture[],
  fixedDeposits: FixedDeposit[],
  targetDate: Date = new Date()
): AccrualEntry[] => {
  const monthEnd = endOfMonth(targetDate);

  const debentureAccruals = debentures.map(debenture => {
    // If matured before this month, no more accruals
    if (isBefore(debenture.maturityDate, startOfMonth(targetDate))) return null;

    const startDate = debenture.lastInterestDate || debenture.purchaseDate;
    
    // Only calculate if the investment was held during this month
    if (isAfter(startDate, monthEnd)) return null;
    
    const accrualDate = isBefore(monthEnd, debenture.maturityDate) ? monthEnd : debenture.maturityDate;
    
    const amount = calculateAccruedInterest(
      debenture.faceValue,
      debenture.interestRate,
      startDate,
      accrualDate
    );

    return {
      investmentId: debenture.id,
      type: 'DEBENTURE' as const,
      amount,
      date: accrualDate
    };
  }).filter((entry): entry is AccrualEntry => entry !== null);

  const fdAccruals = fixedDeposits.map(fd => {
    if (isBefore(fd.maturityDate, startOfMonth(targetDate))) return null;
    if (isAfter(fd.startDate, monthEnd)) return null;
    
    const accrualDate = isBefore(monthEnd, fd.maturityDate) ? monthEnd : fd.maturityDate;
    
    const amount = calculateAccruedInterest(
      fd.principal,
      fd.interestRate,
      fd.startDate, // Simplified: should ideally track cumulative principal for compounding
      accrualDate
    );

    return {
      investmentId: fd.id,
      type: 'FD' as const,
      amount,
      date: accrualDate
    };
  }).filter((entry): entry is AccrualEntry => entry !== null);

  return [...debentureAccruals, ...fdAccruals];
};
