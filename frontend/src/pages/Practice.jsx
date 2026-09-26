import { useState, useEffect } from "react";
import { getQuestions } from "../services/quizApi";
import api from "../services/api";
import QuestionCard from "../components/quiz/QuestionCard";
export default function Practice(){
  const [qs,setQs]=useState([]);
  const [idx,setIdx]=useState(0);
  const [sel,setSel]=useState(null);
  const [res,setRes]=useState(null);
  useEffect(()=>{ getQuestions({limit:5}).then(setQs); },[]);
  const q=qs[idx];
  const submit=async()=>{
    const r=await api.post(`/questions/${q.id}/verify`, {selected_idx: sel});
    setRes(r.data);
  };
  if(!q) return <div className="container">Loading...</div>;
  return <div className="container" style={{maxWidth:700}}><QuestionCard q={q} idx={idx} total={qs.length} selected={sel} onSelect={setSel}/><button className="btn-primary" onClick={submit} disabled={sel==null} style={{marginTop:12}}>Submit</button>{res&&<p style={{marginTop:12}}>{res.is_correct?"Correct":"Wrong"} - {res.explanation}</p>}</div>;
}

