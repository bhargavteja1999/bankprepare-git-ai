export function calculateScore(answers, questions, negative = 0) {
  let score = 0;
  const total = questions.length;
  answers.forEach((ans, i) => {
    if (i >= total) return;
    if (ans === questions[i].answer_idx) score += 1;
    else if (ans != null && ans !== -1) score -= negative;
  });
  score = Math.round(score * 100) / 100;
  const accuracy = total ? Math.round(Math.max(0, score) / total * 100) : 0;
  return { score, total, accuracy, xp: Math.max(0, score) * 10 };
}
