import { NextResponse } from 'next/server';
import { getOptimalQuestions } from '@/lib/optimizer';

export async function POST(request: Request) {
  const body = await request.json();
  const { questions, timeLimit } = body;

  if (!questions || !timeLimit) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // Run the algorithm we wrote in Phase 4
  const result = getOptimalQuestions(questions, timeLimit);

  return NextResponse.json(result);
}