export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  text: string;
  score: number;
  time_required: number;
}

export interface OptimizationResult {
  maxScore: number;
  selectedQuestions: Question[];
}

export interface UserHistory {
  id: string;
  quiz_title: string;
  question_text: string;
  selected_option: string;
  created_at: string;
}