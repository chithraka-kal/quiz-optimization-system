'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Quiz } from '../types';
import Sidebar from '../components/Sidebar';
import QuizCard from '../components/QuizCard'; 

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    supabase.from('quizzes').select('*').then(({ data }) => {
      if (data) setQuizzes(data);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-sans text-neutral-800">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-3xl font-bold text-neutral-900 mb-8">Available Assessments</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </main>
    </div>
  );
}