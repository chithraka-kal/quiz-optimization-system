import { NextResponse } from 'next/server';
import { getOptimalQuestions } from '@/app/lib/optimizer';

export async function POST(request: Request) {
  const body = await request.json();
  const { questions, timeLimit } = body;

  if (!questions || !timeLimit) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // Run the algorithm
  const result = getOptimalQuestions(questions, timeLimit);

  return NextResponse.json(result);
}