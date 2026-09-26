export default function QuestionCard({ q, idx, total, selected, onSelect }) {
  return (
    <div className="quiz-box">
      <span className="badge">Q{idx+1}/{total} | {q.subject} | {q.topic}</span>
      <h3 style={{margin:"12px 0"}}>{q.text}</h3>
      {q.options.map((o,i)=>(
        <div key={i} className={`quiz-option ${selected===i?"selected":""}`} onClick={()=>onSelect(i)}>
          {String.fromCharCode(65+i)}) {o}
        </div>
      ))}
    </div>
  );
}

