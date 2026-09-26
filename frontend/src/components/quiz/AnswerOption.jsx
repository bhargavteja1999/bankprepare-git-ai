export default function AnswerOption({ label, text, selected, correct, showResult, onClick }) {
  let bg="#fff", border="#e2e8f0";
  if (showResult) {
    if (selected && correct) { bg="#dcfce7"; border="#86efac"; }
    else if (selected && !correct) { bg="#fee2e2"; border="#fca5a5"; }
  } else if (selected) { bg="#eff6ff"; border="#0f4c81"; }
  return <div onClick={onClick} style={{padding:"9px 12px", borderRadius:9, border:`1px solid ${border}`, background:bg, cursor:"pointer"}}>{label}. {text}</div>;
}
