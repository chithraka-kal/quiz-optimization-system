'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Clock, ArrowRight, Check, BarChart3, User } from 'lucide-react';

export default function Home() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [timeLimit, setTimeLimit] = useState(5);
  const [optimalSet, setOptimalSet] = useState<any>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [user, setUser] = useState<string>('test_candidate');

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data } = await supabase.from('quizzes').select('*');
      if (data) setQuizzes(data);
    };
    fetchQuizzes();
  }, []);

  const loadQuiz = async (quiz: any) => {
    setSelectedQuizId(quiz.id);
    setQuizTitle(quiz.title);
    setLoading(true);
    const { data } = await supabase.from('questions').select('*').eq('quiz_id', quiz.id);
    if (data) setQuestions(data);
    setOptimalSet(null);
    setLoading(false);
  };

  const handleOptimize = async () => {
    setLoading(true);
    const res = await fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions, timeLimit }),
    });
    const result = await res.json();
    setOptimalSet(result);
    setLoading(false);
  };

  const handleSubmitAnswers = async () => {
     if (!optimalSet) return;
     const { data: dbUser } = await supabase.from('users').select('id').eq('username', user).single();
     if (!dbUser) { alert('User not found'); return; }
     
     const answers = optimalSet.selectedQuestions.map((q: any) => ({
         user_id: dbUser.id,
         question_id: q.id,
         selected_option: 'Optimal Strategy',
         is_correct: true
     }));
     
     const { error } = await supabase.from('answers').insert(answers);
     if (!error) alert('Strategy saved to database!');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-poppins text-neutral-800 bg-[#FAFAFA]">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-full md:w-80 bg-white border-r border-neutral-200 p-8 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="mb-10">
          {/* Changed font to simple sans-serif */}
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-neutral-900">Optimizer.</h1>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Assessment Tool</p>
        </div>

        {/* Quiz List */}
        <div className="flex-1 overflow-y-auto pr-2">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Available Quizzes</h3>
            <div className="space-y-1">
                {quizzes.map((q) => (
                    <button
                        key={q.id}
                        onClick={() => loadQuiz(q)}
                        className={`w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-200 group flex items-center justify-between font-medium ${
                            selectedQuizId === q.id 
                            ? 'bg-neutral-100 text-neutral-900' 
                            : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                        }`}
                    >
                        {q.title}
                        {selectedQuizId === q.id && <div className="w-2 h-2 rounded-full bg-neutral-900" />}
                    </button>
                ))}
            </div>
        </div>

        {/* USER PROFILE */}
        <div className="pt-6 border-t border-neutral-100 mt-4">
             <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors cursor-default">
                <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-white shadow-sm">
                    <User size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900 leading-none mb-1">Candidate</span>
                    <span className="text-xs text-neutral-400 font-medium">@{user}</span>
                </div>
             </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {!selectedQuizId ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
                <BarChart3 size={48} className="mb-6 text-neutral-300" />
                <p className="text-xl font-medium text-neutral-400">Select a quiz to begin analysis</p>
            </div>
        ) : (
            <div className="max-w-4xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="border-b border-neutral-200 pb-8 flex justify-between items-end">
                    <div>
                        {/* Simple Sans Heading */}
                        <h2 className="text-3xl font-bold text-neutral-900 mb-2 tracking-tight">{quizTitle}</h2>
                        <p className="text-neutral-500 font-medium">{questions.length} questions available</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <span className="block text-xs uppercase tracking-widest text-neutral-400 mb-2 font-bold">Status</span>
                        <span className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Active
                        </span>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Configuration */}
                    <div className="space-y-6">
                        
                        {/* Time Control */}
                        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">
                                <Clock size={14} /> Time Constraint
                            </label>
                            
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-bold text-neutral-900 tracking-tighter">{timeLimit}</span>
                                <span className="text-neutral-400 font-medium">minutes</span>
                            </div>
                            
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(Number(e.target.value))}
                                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-neutral-900 hover:accent-neutral-700"
                            />
                            <div className="flex justify-between text-xs text-neutral-400 mt-3 font-medium">
                                <span>1m</span>
                                <span>20m</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleOptimize}
                            disabled={loading}
                            className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-neutral-200/50 disabled:opacity-70 active:scale-[0.98]"
                        >
                           {loading ? 'Processing...' : (
                                <>
                                    Calculate Strategy <ArrowRight size={18} strokeWidth={2.5} />
                                </>
                           )}
                        </button>
                    </div>

                    {/* Right: Results / Data */}
                    <div className="lg:col-span-2">
                        {optimalSet ? (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm ring-1 ring-black/5">
                                    <div className="bg-neutral-50/50 border-b border-neutral-100 p-6 flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-neutral-900">Optimal Selection</h3>
                                        <span className="font-mono text-sm font-bold bg-neutral-900 text-white px-3 py-1.5 rounded-md">
                                            {optimalSet.maxScore} PTS
                                        </span>
                                    </div>
                                    <div className="divide-y divide-neutral-100">
                                        {optimalSet.selectedQuestions.map((q: any) => (
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
                                            onClick={handleSubmitAnswers}
                                            className="w-full text-sm font-bold text-neutral-700 hover:text-neutral-900 py-2.5 border border-neutral-200 hover:border-neutral-300 bg-white rounded-lg hover:shadow-sm transition-all"
                                        >
                                            Save to Database
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Default View */
                            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-6">Raw Data</h3>
                                <ul className="space-y-4">
                                    {questions.map((q) => (
                                        <li key={q.id} className="flex justify-between items-start text-sm border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                                            <span className="text-neutral-600 font-medium max-w-[70%] leading-relaxed">{q.text}</span>
                                            <span className="font-mono text-neutral-400 font-medium text-xs bg-neutral-50 px-2 py-1 rounded">
                                                {q.time_required}m / {q.score}p
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}