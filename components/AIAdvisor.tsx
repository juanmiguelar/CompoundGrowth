import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getFinancialAdvice } from '../services/geminiService';
import { CalculationParams, CalculationResult } from '../types';

interface AIAdvisorProps {
  params: CalculationParams;
  results: CalculationResult;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ params, results }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAdvice(null);
    const response = await getFinancialAdvice(params, results);
    setAdvice(response);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-primary-700 to-primary-900 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-300">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.97 14.12a.75.75 0 01-.482.23l-1.597.185a.75.75 0 01-.695-.956l.62-1.534a.75.75 0 01.568-.455l1.597-.184a.75.75 0 01.695.956l-.62 1.533a.75.75 0 01-.087.225zM17.03 9.88a.75.75 0 01.482-.23l1.597-.185a.75.75 0 01.695.956l-.62 1.534a.75.75 0 01-.568.455l-1.597.184a.75.75 0 01-.695-.956l.62-1.533a.75.75 0 01.087-.225z" clipRule="evenodd" />
            </svg>
            Gemini Advisor
          </h2>
          <p className="text-primary-100 text-sm mt-1">Get AI-powered insights on your wealth strategy.</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-white text-primary-900 text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Analyzing...' : 'Analyze Scenario'}
        </button>
      </div>
      
      <div className="p-6">
        {!advice && !loading && (
          <div className="text-center py-8 text-slate-500">
            <p>Click "Analyze Scenario" to generate a personalized financial assessment.</p>
          </div>
        )}
        
        {loading && (
          <div className="animate-pulse space-y-4 py-4">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded w-2/3"></div>
          </div>
        )}

        {advice && (
          <div className="prose prose-sm prose-slate max-w-none">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};