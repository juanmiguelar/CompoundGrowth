import { CompoundingFrequency } from './types';

export const DEFAULT_PARAMS = {
  initialPrincipal: 10000,
  monthlyContribution: 500,
  interestRate: 7,
  inflationRate: 2.5,
  years: 20,
  compoundFrequency: CompoundingFrequency.MONTHLY,
};

export const FREQUENCY_OPTIONS = [
  { label: 'Annually', value: CompoundingFrequency.ANNUALLY },
  { label: 'Quarterly', value: CompoundingFrequency.QUARTERLY },
  { label: 'Monthly', value: CompoundingFrequency.MONTHLY },
  { label: 'Daily', value: CompoundingFrequency.DAILY },
];