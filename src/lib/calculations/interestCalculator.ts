import { differenceInDays, addDays } from "date-fns";

export const calculateAccruedInterest = (
  faceValue: number,
  interestRate: number,
  lastInterestDate: Date,
  currentDate: Date = new Date()
) => {
  const daysElapsed = differenceInDays(currentDate, lastInterestDate);
  if (daysElapsed <= 0) return 0;
  
  // Daily accrual: (faceValue × rate × daysElapsed) / 365
  // Note: interestRate is assumed to be in percentage (e.g., 10 for 10%)
  const accrual = (faceValue * (interestRate / 100) * daysElapsed) / 365;
  return accrual;
};

export const calculateMaturityValue = (
  principal: number,
  interestRate: number,
  startDate: Date,
  maturityDate: Date,
  compoundingFrequency: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY' | 'NONE'
) => {
  const years = differenceInDays(maturityDate, startDate) / 365;
  
  if (compoundingFrequency === 'NONE') {
    return principal + (principal * (interestRate / 100) * years);
  }

  let n = 1;
  switch (compoundingFrequency) {
    case 'MONTHLY': n = 12; break;
    case 'QUARTERLY': n = 4; break;
    case 'HALF_YEARLY': n = 2; break;
    case 'YEARLY': n = 1; break;
  }

  // A = P(1 + r/n)^(nt)
  const amount = principal * Math.pow(1 + (interestRate / 100) / n, n * years);
  return amount;
};
