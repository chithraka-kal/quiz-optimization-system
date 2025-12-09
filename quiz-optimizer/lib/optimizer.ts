type Question = {
  id: string;
  text: string;
  score: number;
  time_required: number;
};

export function getOptimalQuestions(questions: Question[], timeLimit: number) {
  const n = questions.length;
  // dp[i][w] stores the max score using first i items with weight limit w
  const dp = Array(n + 1).fill(0).map(() => Array(timeLimit + 1).fill(0));

  // Build the table
  for (let i = 1; i <= n; i++) {
    const { score, time_required } = questions[i - 1];
    for (let w = 0; w <= timeLimit; w++) {
      if (time_required <= w) {
        // Max of (not taking item, taking item + value of remaining space)
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - time_required] + score);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find WHICH questions were selected
  const selectedQuestions: Question[] = [];
  let w = timeLimit;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      // If value changed, it means we included this item
      const question = questions[i - 1];
      selectedQuestions.push(question);
      w -= question.time_required;
    }
  }

  return {
    maxScore: dp[n][timeLimit],
    selectedQuestions,
  };
}