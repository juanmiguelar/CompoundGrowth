export interface CalculationParams {
  initialPrincipal: number;
  monthlyContribution: number;
  interestRate: number;
  inflationRate: number;
  years: number;
  compoundFrequency: number; // Times per year (1, 4, 12)
}

export interface YearlyResult {
  year: number;
  invested: number;
  interest: number;
  total: number;
  realValue: number;
}

export interface CalculationResult {
  totalInvested: number;
  totalInterest: number;
  futureValue: number;
  futureValueReal: number;
  breakdown: YearlyResult[];
}

export interface SavedScenario {
  id: string;
  name: string;
  params: CalculationParams;
  createdAt: number;
}

export enum CompoundingFrequency {
  ANNUALLY = 1,
  QUARTERLY = 4,
  MONTHLY = 12,
  DAILY = 365
}