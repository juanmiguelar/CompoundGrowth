import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart
} from 'recharts';
import { CalculationResult } from '../types';

interface NamedResult {
  id: string;
  name: string;
  result: CalculationResult;
}

interface ResultsChartProps {
  currentResult: CalculationResult;
  savedScenarios: NamedResult[];
}

const COMPARE_COLORS = ['#9333ea', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

export const ResultsChart: React.FC<ResultsChartProps> = ({ currentResult, savedScenarios }) => {
  
  // Transform data for visualization
  const chartData = useMemo(() => {
    const dataMap = new Map<number, any>();
    const maxYears = Math.max(
      currentResult.breakdown.length,
      ...savedScenarios.map(s => s.result.breakdown.length)
    );

    // Initialize map
    for (let i = 1; i <= maxYears; i++) {
      dataMap.set(i, { year: i });
    }

    // Add Current Result Data
    currentResult.breakdown.forEach(item => {
      const entry = dataMap.get(item.year);
      if (entry) {
        entry.currentTotal = item.total;
        entry.currentInvested = item.invested;
        entry.currentReal = item.realValue;
      }
    });

    // Add Saved Scenarios Data
    savedScenarios.forEach((scenario, index) => {
      const key = `scenario_${scenario.id}`;
      scenario.result.breakdown.forEach(item => {
        const entry = dataMap.get(item.year);
        if (entry) {
          entry[key] = item.total;
        }
      });
    });

    return Array.from(dataMap.values()).sort((a, b) => a.year - b.year);
  }, [currentResult, savedScenarios]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <div className="h-[450px] w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Growth Projection {savedScenarios.length > 0 && '& Comparison'}</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="year" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickMargin={10}
              label={{ value: 'Years', position: 'insideBottomRight', offset: -10, fill: '#94a3b8' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              labelFormatter={(label) => `Year ${label}`}
              formatter={(value: number, name: string) => {
                // Map keys back to readable names
                if (name === 'currentTotal') return [`$${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 'Current (Nominal)'];
                if (name === 'currentReal') return [`$${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 'Current (Real)'];
                if (name === 'currentInvested') return [`$${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 'Principal'];
                
                const scenarioId = name.replace('scenario_', '');
                const scenario = savedScenarios.find(s => s.id === scenarioId);
                return [`$${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, scenario ? scenario.name : name];
              }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36}/>
            
            {/* Current Scenario Areas */}
            <Area
              type="monotone"
              dataKey="currentTotal"
              name="Current (Nominal)"
              stroke="#22c55e"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="currentReal"
              name="Current (Real)"
              stroke="#0ea5e9"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReal)"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="currentInvested"
              name="Principal"
              stroke="#334155"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="none"
              animationDuration={1000}
            />

            {/* Comparison Lines */}
            {savedScenarios.map((scenario, index) => (
              <Line
                key={scenario.id}
                type="monotone"
                dataKey={`scenario_${scenario.id}`}
                name={scenario.name}
                stroke={COMPARE_COLORS[index % COMPARE_COLORS.length]}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
              />
            ))}

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};