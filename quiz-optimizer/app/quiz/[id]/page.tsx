'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '../../lib/supabase';
import { Question, OptimizationResult } from '../../types';
import Sidebar from '../../components/Sidebar';
import ResultCard from '../../components/ResultCard';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function QuizOptimizer({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params 
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;

  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLimit, setTimeLimit] = useState(5);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase.from('questions').select('*').eq('quiz_id', quizId);
      if (data) setQuestions(data);
    };
    fetchQuestions();
  }, [quizId]);

  const handleOptimize = async () => {
    setLoading(true);
    const res = await fetch('/api/optimize', {
      method: 'POST',
      body: JSON.stringify({ questions, timeLimit }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };


  const handleSave = async () => {
    if (!result) return;
    
    // Get User
    const { data: user } = await supabase.from('users').select('id').eq('username', 'test_candidate').single();
    if (!user) return alert('User not found');

    // Prepare Inserts
    const answers = result.selectedQuestions.map(q => ({
      user_id: user.id,
      question_id: q.id,
      selected_option: 'Optimal Strategy',
      is_correct: true
    }));

    const { error } = await supabase.from('answers').insert(answers);
    
    if (!error) {
      alert('Saved!');
      router.push('/history'); 
    }
  };
  // -------------------------

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-sans text-neutral-800">
      <Sidebar />
      <main className="flex-1 p-10">
        <Link href="/quizzes" className="text-sm text-neutral-400 hover:text-neutral-900 mb-6 inline-flex items-center gap-1 font-medium">
          &larr; Back to Quizzes
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Config */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                    <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-wider">
                        <Clock size={16} /> Time Limit
                    </h3>
                    <div className="text-4xl font-bold mb-4">{timeLimit} <span className="text-sm text-neutral-400 font-normal">min</span></div>
                    <input 
                        type="range" min="1" max="20" value={timeLimit} 
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                    />
                </div>
                <button 
                    onClick={handleOptimize}
                    disabled={loading}
                    className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-neutral-200"
                >
                    {loading ? 'Calculating...' : 'Run Optimization'}
                </button>
            </div>

            {/* Right Col: Data/Results */}
            <div className="lg:col-span-2 space-y-6">
                {result ? (
                    
                    <ResultCard result={result} onSave={handleSave} />
                ) : (
                    <div className="bg-white p-6 rounded-xl border border-neutral-200">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase mb-4">Questions available</h3>
                        <ul className="space-y-4">
                            {questions.map(q => (
                                <li key={q.id} className="text-sm flex justify-between border-b border-neutral-50 pb-2">
                                    <span className="text-neutral-600 font-medium">{q.text}</span>
                                    <span className="text-neutral-400 font-mono text-xs bg-neutral-50 px-2 py-1 rounded">{q.time_required}m</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}