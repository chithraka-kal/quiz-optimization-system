'use client';

import Link from 'next/link';
import { ArrowRight, Brain, Globe, Film, Trophy } from 'lucide-react';
import { Quiz } from '../types';


const getIcon = (title: string) => {
  if (title.includes('Computer')) return <Brain size={20} className="text-neutral-700" />;
  if (title.includes('Geography')) return <Globe size={20} className="text-neutral-700" />;
  if (title.includes('Movies')) return <Film size={20} className="text-neutral-700" />;
  return <Trophy size={20} className="text-neutral-700" />;
};

interface QuizCardProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow flex flex-col items-start h-full">
      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
        {getIcon(quiz.title)}
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-2">{quiz.title}</h3>
      <p className="text-sm text-neutral-500 mb-6 flex-1">
        {quiz.description || "No description available."}
      </p>
      
      <Link 
        href={`/quiz/${quiz.id}`}
        className="inline-flex items-center text-sm font-bold text-neutral-900 hover:gap-2 transition-all mt-auto"
      >
        Start Optimization <ArrowRight size={16} className="ml-1" />
      </Link>
    </div>
  );
}