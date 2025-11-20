import React from 'react';
import { CalculationResult, CalculationParams } from '../types';

interface ComparisonItem {
  id: string;
  name: string;
  params: CalculationParams;
  result: CalculationResult;
  isCurrent?: boolean;
}

interface ComparisonTableProps {
  current: ComparisonItem;
  saved: ComparisonItem[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ current, saved }) => {
  const items = [current, ...saved];

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Scenario Comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 font-medium">Scenario</th>
              <th className="px-6 py-3 font-medium">Principal</th>
              <th className="px-6 py-3 font-medium">Monthly</th>
              <th className="px-6 py-3 font-medium">Rate / Yrs</th>
              <th className="px-6 py-3 font-medium text-right">Total Invested</th>
              <th className="px-6 py-3 font-medium text-right">Future Value</th>
              <th className="px-6 py-3 font-medium text-right text-blue-600">Real Value</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr 
                key={item.id} 
                className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${item.isCurrent ? 'bg-green-50/30' : ''}`}
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.isCurrent && <span className="mr-2 inline-block w-2 h-2 rounded-full bg-green-500"></span>}
                  {item.name}
                </td>
                <td className="px-6 py-4 text-slate-600">${fmt(item.params.initialPrincipal)}</td>
                <td className="px-6 py-4 text-slate-600">${fmt(item.params.monthlyContribution)}</td>
                <td className="px-6 py-4 text-slate-600">{item.params.interestRate}% / {item.params.years}y</td>
                <td className="px-6 py-4 text-right text-slate-600">${fmt(item.result.totalInvested)}</td>
                <td className="px-6 py-4 text-right font-semibold text-slate-900">${fmt(item.result.futureValue)}</td>
                <td className="px-6 py-4 text-right font-semibold text-blue-600">${fmt(item.result.futureValueReal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};