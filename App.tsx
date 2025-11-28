import React, { useState, useMemo, useEffect } from 'react';
import { InputGroup } from './components/InputGroup';
import { SelectGroup } from './components/SelectGroup';
import { ResultsChart } from './components/ResultsChart';
import { ScenarioList } from './components/ScenarioList';
import { ComparisonTable } from './components/ComparisonTable';
import { AboutDeveloper } from './components/AboutDeveloper';
import { calculateCompoundInterest } from './utils/calculator';
import { DEFAULT_PARAMS, FREQUENCY_OPTIONS } from './constants';
import { CalculationParams, SavedScenario } from './types';

const App: React.FC = () => {
  const [params, setParams] = useState<CalculationParams>(DEFAULT_PARAMS);
  const [scenarioName, setScenarioName] = useState("My Strategy");
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('compound_growth_header_expanded');
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });

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

  // Persist header state
  useEffect(() => {
    localStorage.setItem('compound_growth_header_expanded', String(isHeaderExpanded));
  }, [isHeaderExpanded]);



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
            <p className="text-xl font-bold tracking-tight text-slate-900" aria-label="CompoundGrowth brand">
              CompoundGrowth
            </p>
          </div>
          <a href="https://www.buymeacoffee.com/juanmiguelar09" target="_blank" rel="noreferrer">
            <img 
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
              alt="Buy Me A Coffee" 
              className="h-10 w-auto"
            />
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8 transition-all duration-200">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-slate-900 leading-tight pr-4">
              Online compound interest calculator for monthly contributions and inflation
            </h1>
            <button 
              onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 transition-colors"
              aria-label={isHeaderExpanded ? "Collapse section" : "Expand section"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isHeaderExpanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
            </button>
          </div>

          {isHeaderExpanded && (
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="space-y-3 max-w-3xl">
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Project your investment growth with monthly contributions, inflation, and different compounding frequencies. Save scenarios, compare strategies, and understand the real value of your money with clear data.
                </p>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Jump to the <a href="#comparison" className="text-primary-700 font-semibold hover:underline">scenario comparison</a> or read the <a href="#faq" className="text-primary-700 font-semibold hover:underline">compound interest FAQ</a>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">Realistic projections</h3>
                    <p className="text-xs text-slate-600">Includes inflation and compounding frequency for more precise results.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">Quick comparisons</h3>
                    <p className="text-xs text-slate-600">Save strategies and test contributions, rates, and investment horizons.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">Share-ready</h3>
                    <p className="text-xs text-slate-600">Clear charts and tables to guide informed decisions.</p>
                  </div>
                </div>
              </div>
              <div className="self-start w-full md:w-auto">
                <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800 max-w-xs">
                  Built for personal finance, retirement saving, and portfolio simulations.
                </div>
              </div>
            </div>
          )}
        </section>

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

            {/* About Developer */}
            <AboutDeveloper />
          </div>

          {/* Right Content: Chart & Comparison */}
          <div className="lg:col-span-8 space-y-6">
            {/* Chart */}
            <div id="growth-chart">
              <ResultsChart currentResult={results} savedScenarios={comparisonData} />
            </div>

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
              <div id="comparison">
                <ComparisonTable current={currentComparisonItem} saved={comparisonData} />
              </div>
            )}
          </div>
        </div>

        <section id="faq" className="mt-10 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Frequently asked questions about compound interest</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">How is compound interest calculated?</h3>
                <p className="text-sm text-slate-600">We apply the classic compound interest formula adjusted to the compounding frequency and your monthly contributions. Each period adds interest to principal and reinvests it.</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Why include inflation?</h3>
                <p className="text-sm text-slate-600">The real value of your money depends on purchasing power. The calculator subtracts annual inflation to show what your investment would be worth in today's terms.</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Which compounding frequency is best?</h3>
                <p className="text-sm text-slate-600">It depends on the financial product: annual, quarterly, monthly, or daily. Test each option here to see how the effective rate and final return change.</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Can I compare different contributions?</h3>
                <p className="text-sm text-slate-600">Yes. Save scenarios with different contributions, rates, or time horizons, and compare them in the table and chart to choose the strategy that fits your goals.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
