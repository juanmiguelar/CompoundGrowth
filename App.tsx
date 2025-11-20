import React, { useState, useMemo, useEffect } from 'react';
import { InputGroup } from './components/InputGroup';
import { SelectGroup } from './components/SelectGroup';
import { ResultsChart } from './components/ResultsChart';
import { ScenarioList } from './components/ScenarioList';
import { ComparisonTable } from './components/ComparisonTable';
import { calculateCompoundInterest } from './utils/calculator';
import { DEFAULT_PARAMS, FREQUENCY_OPTIONS } from './constants';
import { CalculationParams, SavedScenario } from './types';

const App: React.FC = () => {
  const [params, setParams] = useState<CalculationParams>(DEFAULT_PARAMS);
  const [scenarioName, setScenarioName] = useState("My Strategy");
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('compound_growth_scenarios');
    if (stored) {
      try {
        setSavedScenarios(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved scenarios", e);
      }
    }
  }, []);

  // Persist to LocalStorage whenever savedScenarios changes
  useEffect(() => {
    localStorage.setItem('compound_growth_scenarios', JSON.stringify(savedScenarios));
  }, [savedScenarios]);

  // Derived state for calculation results
  const results = useMemo(() => calculateCompoundInterest(params), [params]);

  const handleChange = (field: keyof CalculationParams, value: number) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveScenario = () => {
    const newScenario: SavedScenario = {
      id: Date.now().toString(),
      name: scenarioName || `Scenario ${savedScenarios.length + 1}`,
      params: { ...params },
      createdAt: Date.now()
    };
    setSavedScenarios([...savedScenarios, newScenario]);
  };

  const handleLoadScenario = (scenario: SavedScenario) => {
    setParams(scenario.params);
    setScenarioName(scenario.name);
  };

  const handleDeleteScenario = (id: string) => {
    setSavedScenarios(savedScenarios.filter(s => s.id !== id));
  };

  // Format helper
  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Prepare data for chart and table comparison
  const comparisonData = useMemo(() => {
    return savedScenarios.map(s => ({
      id: s.id,
      name: s.name,
      params: s.params,
      result: calculateCompoundInterest(s.params)
    }));
  }, [savedScenarios]);

  const currentComparisonItem = {
    id: 'current',
    name: scenarioName || 'Current Draft',
    params: params,
    result: results,
    isCurrent: true
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 rounded-lg p-1.5">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">CompoundGrowth.ai</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold text-slate-900">Parameters</h2>
              </div>
              
              <div className="space-y-5">
                {/* Scenario Name & Save */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                   <InputGroup
                      label="Scenario Name"
                      type="text"
                      value={scenarioName}
                      onChange={setScenarioName}
                      placeholder="e.g., Aggressive Growth"
                    />
                    <button
                      onClick={handleSaveScenario}
                      className="w-full py-2 px-4 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors text-sm"
                    >
                      Save Scenario
                    </button>
                </div>

                <InputGroup
                  label="Initial Investment"
                  value={params.initialPrincipal}
                  onChange={(val) => handleChange('initialPrincipal', val)}
                  prefix="$"
                />
                <InputGroup
                  label="Monthly Contribution"
                  value={params.monthlyContribution}
                  onChange={(val) => handleChange('monthlyContribution', val)}
                  prefix="$"
                />
                <InputGroup
                  label="Interest Rate (Annual)"
                  value={params.interestRate}
                  onChange={(val) => handleChange('interestRate', val)}
                  suffix="%"
                  step={0.1}
                />
                <InputGroup
                  label="Inflation Rate (Annual)"
                  value={params.inflationRate}
                  onChange={(val) => handleChange('inflationRate', val)}
                  suffix="%"
                  step={0.1}
                />
                <InputGroup
                  label="Investment Period"
                  value={params.years}
                  onChange={(val) => handleChange('years', val)}
                  suffix="Years"
                  min={1}
                  step={1}
                />
                <SelectGroup
                  label="Compounding Frequency"
                  value={params.compoundFrequency}
                  options={FREQUENCY_OPTIONS}
                  onChange={(val) => handleChange('compoundFrequency', val)}
                />
              </div>
            </div>

            {/* Saved Scenarios List */}
            <ScenarioList 
              scenarios={savedScenarios} 
              onLoad={handleLoadScenario} 
              onDelete={handleDeleteScenario} 
            />

            {/* Current Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Current Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 text-sm">Principal</span>
                  <span className="font-semibold text-slate-900">${fmt(results.totalInvested)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-primary-700 text-sm">Total Interest</span>
                  <span className="font-bold text-primary-700">+${fmt(results.totalInterest)}</span>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 gap-4">
                  <div className="text-center">
                     <p className="text-slate-500 text-xs uppercase tracking-wider font-medium mb-1">Future Value (Nominal)</p>
                     <p className="text-3xl font-bold text-slate-900">${fmt(results.futureValue)}</p>
                  </div>
                  <div className="text-center bg-blue-50 py-3 rounded-lg border border-blue-100">
                     <p className="text-blue-600 text-xs uppercase tracking-wider font-semibold mb-1">Real Value (Inflation Adj.)</p>
                     <p className="text-2xl font-bold text-blue-700">${fmt(results.futureValueReal)}</p>
                     <p className="text-xs text-blue-500 mt-1">Purchasing Power Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content: Chart & Comparison */}
          <div className="lg:col-span-8 space-y-6">
            {/* Chart */}
            <ResultsChart currentResult={results} savedScenarios={comparisonData} />

            {/* Stats Grid (Visible when only 1 scenario, otherwise can be redundant but still nice) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Years to Double</span>
                <span className="text-2xl font-bold text-slate-800 mt-1">
                  {params.interestRate > 0 ? (72 / params.interestRate).toFixed(1) : '∞'}
                </span>
                <span className="text-xs text-slate-400 mt-1">Rule of 72</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Real Return Rate</span>
                <span className="text-2xl font-bold text-primary-600 mt-1">
                  {(((1 + params.interestRate/100) / (1 + params.inflationRate/100) - 1) * 100).toFixed(2)}%
                </span>
                <span className="text-xs text-slate-400 mt-1">Approx. Interest - Inflation</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">End Monthly Passive</span>
                <span className="text-2xl font-bold text-slate-800 mt-1">
                  ${fmt((results.futureValue * (params.interestRate / 100)) / 12)}
                </span>
                <span className="text-xs text-slate-400 mt-1">@ {params.interestRate}% withdraw</span>
              </div>
            </div>

            {/* Comparison Table */}
            {savedScenarios.length > 0 && (
              <ComparisonTable current={currentComparisonItem} saved={comparisonData} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;