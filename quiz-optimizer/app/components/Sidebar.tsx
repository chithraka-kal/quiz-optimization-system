'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Clock, History, User } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-full md:w-64 bg-white border-r border-neutral-200 p-6 flex flex-col h-screen sticky top-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Optimizer.</h1>
        <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Assessment Tool</p>
      </div>

      <nav className="flex-1 space-y-1">
        <Link 
          href="/quizzes" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/quizzes') ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <Layout size={18} />
          Quizzes
        </Link>
        
        <Link 
          href="/history" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive('/history') ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          <History size={18} />
          Attempt History
        </Link>
      </nav>

      <div className="pt-6 border-t border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white">
            <User size={14} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">User</p>
            <p className="text-xs text-neutral-400">@test_user</p>
          </div>
        </div>
      </div>
    </aside>
  );
}