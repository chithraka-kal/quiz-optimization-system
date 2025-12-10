'use client';

import { Check } from 'lucide-react';
import { OptimizationResult } from '../types';

interface ResultCardProps {
  result: OptimizationResult;
  onSave: () => void;
}

export default function ResultCard({ result, onSave }: ResultCardProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-neutral-50/50 border-b border-neutral-100 p-6 flex justify-between items-center">
          <h3 className="text-lg font-bold text-neutral-900">Optimal Strategy</h3>
          <span className="font-mono text-sm font-bold bg-neutral-900 text-white px-3 py-1.5 rounded-md">
              Score: {result.maxScore}
          </span>
      </div>
      
      <div className="divide-y divide-neutral-100">
          {result.selectedQuestions.map((q) => (
              <div key={q.id} className="p-5 flex gap-4 hover:bg-neutral-50 transition-colors group">
                  <div className="mt-0.5 w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center shrink-0 text-emerald-600 bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                      <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                      <p className="text-neutral-900 font-medium leading-snug">{q.text}</p>
                      <div className="flex gap-4 mt-2 text-xs text-neutral-400 font-medium uppercase tracking-wide">
                          <span>Time: {q.time_required}m</span>
                          <span>Score: {q.score}</span>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      <div className="p-4 bg-neutral-50/50 border-t border-neutral-100">
          <button 
              onClick={onSave}
              className="w-full text-sm font-bold text-neutral-700 hover:text-neutral-900 py-2.5 border border-neutral-200 hover:border-neutral-300 bg-white rounded-lg hover:shadow-sm transition-all"
          >
              Save to History
          </button>
      </div>
    </div>
  );
}