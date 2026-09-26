import { useState } from "react";
import { askTutor } from "../../services/aiApi";
export default function AIChat() {
  const [q,setQ]=useState(""), [a,setA]=useState("");
  const ask=async()=>{ const r=await askTutor(q); setA(r.answer); };
  return <div><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask tutor..."/><button onClick={ask}>Ask</button><p>{a}</p></div>;
}
