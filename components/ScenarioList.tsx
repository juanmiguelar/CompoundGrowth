import React from 'react';
import { SavedScenario } from '../types';

interface ScenarioListProps {
  scenarios: SavedScenario[];
  onLoad: (scenario: SavedScenario) => void;
  onDelete: (id: string) => void;
}

export const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios, onLoad, onDelete }) => {
  if (scenarios.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-900">Saved Scenarios</h2>
      <div className="space-y-3">
        {scenarios.map((scenario) => (
          <div 
            key={scenario.id}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex-1 min-w-0 mr-3">
              <h3 className="text-sm font-semibold text-slate-900 truncate">{scenario.name}</h3>
              <p className="text-xs text-slate-500 truncate">
                {scenario.params.years} yr • {scenario.params.interestRate}% Return
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLoad(scenario)}
                className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                title="Load Scenario"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.433l-.31-.31a7 7 0 00-11.712 3.138.75.75 0 001.449.39 5.5 5.5 0 019.201-2.466l.312.312h-2.433a.75.75 0 000 1.5h4.242z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(scenario.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Delete Scenario"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};