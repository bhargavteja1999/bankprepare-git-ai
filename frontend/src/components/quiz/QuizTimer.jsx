import { useEffect, useState } from "react";
import { formatTime } from "../../utils/formatTime";
export default function QuizTimer({ durationMin, onExpire }) {
  const [left, setLeft] = useState(durationMin*60);
  useEffect(()=>{
    const id=setInterval(()=> setLeft(t=>{ if(t<=1){ onExpire?.(); clearInterval(id); return 0;} return t-1;}),1000);
    return ()=>clearInterval(id);
  },[onExpire]);
  return <span style={{background:left<60?"#dc2626":"#0f4c81", color:"#fff", padding:"4px 10px", borderRadius:999}}>{formatTime(left)}</span>;
}
