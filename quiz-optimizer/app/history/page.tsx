'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      // Supabase join query: Answers -> Questions -> Quizzes
      const { data, error } = await supabase
        .from('answers')
        .select(`
            created_at,
            questions (
                text,
                score,
                quizzes ( title )
            )
        `)
        .order('created_at', { ascending: false });

      if (data) setHistory(data);
      if (error) console.error('Error fetching history:', error);
      setLoading(false);
    };
    fetchHistory();
  }, []);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-sans text-neutral-800">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-3xl font-bold text-neutral-900 mb-8">Attempt History</h2>

        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                        <th className="p-4 font-bold text-neutral-600">Date</th>
                        <th className="p-4 font-bold text-neutral-600">Quiz</th>
                        <th className="p-4 font-bold text-neutral-600">Question Answered</th>
                        <th className="p-4 font-bold text-neutral-600 text-right">Points</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                    {loading ? (
                        <tr><td colSpan={4} className="p-8 text-center text-neutral-400">Loading history...</td></tr>
                    ) : history.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-neutral-400">No attempts recorded yet.</td></tr>
                    ) : (
                        history.map((item: any, i) => (
                            <tr key={i} className="hover:bg-neutral-50 transition-colors">
                                <td className="p-4 text-neutral-500 font-medium">
                                    {formatDate(item.created_at)}
                                </td>
                                <td className="p-4 font-bold text-neutral-900">
                                    
                                    {item.questions?.quizzes?.title || 'Unknown Quiz'}
                                </td>
                                <td className="p-4 text-neutral-600 max-w-md truncate">
                                    {item.questions?.text || 'Unknown Question'}
                                </td>
                                <td className="p-4 text-right font-mono text-emerald-600 font-bold">
                                    +{item.questions?.score || 0}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </main>
    </div>
  );
}