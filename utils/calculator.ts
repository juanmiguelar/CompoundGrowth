import { CalculationParams, CalculationResult, YearlyResult } from '../types';

export const calculateCompoundInterest = (params: CalculationParams): CalculationResult => {
  const { initialPrincipal, monthlyContribution, interestRate, inflationRate, years, compoundFrequency } = params;
  
  const rateDecimal = interestRate / 100;
  const totalMonths = years * 12;
  const breakdown: YearlyResult[] = [];

  let currentBalance = initialPrincipal;
  let totalInvested = initialPrincipal;

  let pendingInterest = 0;
  const monthlyRateSimple = rateDecimal / 12;
  const effectiveCompoundingInterval = Math.max(1, Math.floor(12 / compoundFrequency));
  const inflationDecimal = (inflationRate || 0) / 100;

  for (let y = 1; y <= years; y++) {
    
    for (let m = 1; m <= 12; m++) {
       const monthIndex = (y - 1) * 12 + m;
       
       // Calculate simple interest on current principal
       const monthlyInterest = currentBalance * monthlyRateSimple;
       pendingInterest += monthlyInterest;
       
       // Add monthly contribution
       currentBalance += monthlyContribution;
       totalInvested += monthlyContribution;
       
       // Check compounding
       if (compoundFrequency >= 12) {
         // Compound every month
         currentBalance += pendingInterest;
         pendingInterest = 0;
       } else {
         // Compound at specific intervals
         if (m % effectiveCompoundingInterval === 0) {
            currentBalance += pendingInterest;
            pendingInterest = 0;
         }
       }
    }
    
    // Calculate Real Value for this year (Inflation Adjusted)
    // Formula: Nominal / (1 + inflation_rate)^years
    const discountFactor = Math.pow(1 + inflationDecimal, y);
    const realValue = currentBalance / discountFactor;

    breakdown.push({
      year: y,
      invested: totalInvested,
      interest: currentBalance - totalInvested,
      total: currentBalance,
      realValue: realValue
    });
  }

  const finalDiscountFactor = Math.pow(1 + inflationDecimal, years);
  const futureValueReal = currentBalance / finalDiscountFactor;

  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalInterest: Math.round((currentBalance - totalInvested) * 100) / 100,
    futureValue: Math.round(currentBalance * 100) / 100,
    futureValueReal: Math.round(futureValueReal * 100) / 100,
    breakdown
  };
};