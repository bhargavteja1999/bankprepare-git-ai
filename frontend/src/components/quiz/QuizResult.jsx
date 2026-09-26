export default function QuizResult({ score, total, accuracy }) {
  return <div style={{padding:12, background: accuracy>=70?"#dcfce7":"#fee2e2", borderRadius:10}}><strong>{score}/{total} | {accuracy}%</strong></div>;
}

