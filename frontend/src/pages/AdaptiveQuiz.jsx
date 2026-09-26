import { useEffect, useState } from "react";
import { startAdaptive, answerAdaptive, getAdaptivePerformance } from "../services/adaptiveApi";

export default function AdaptiveQuiz(){
  const [perf,setPerf]=useState(null);
  const [session,setSession]=useState(null);
  const [question,setQuestion]=useState(null);
  const [selected,setSelected]=useState(null);
  const [msg,setMsg]=useState("");
  const [timeStart,setTimeStart]=useState(0);
  const [loading,setLoading]=useState(false);
  const loadPerf=async()=>{ try{ const p=await getAdaptivePerformance(); setPerf(p[0]||p); }catch{} };
  useEffect(()=>{ loadPerf(); },[]);
  const start=async()=>{
    setLoading(true);
    try{
      const r=await startAdaptive("General");
      setSession({quiz_id: r.quiz_id, current_difficulty: r.current_difficulty});
      setQuestion(r.question);
      setTimeStart(Date.now());
      setSelected(null); setMsg("");
    }catch(e){ alert(e.response?.data?.detail||e.message); }
    finally{ setLoading(false); }
  };
  const submit=async()=>{
    if(selected===null||!question) return;
    const time_taken=(Date.now()-timeStart)/1000;
    const r=await answerAdaptive(session.quiz_id, {question_id: question.id, selected_answer: selected, time_taken});
    setMsg(`${r.is_correct?"œ“ Correct":"œ- Wrong"} - ${r.message} (Next: ${r.current_difficulty})`);
    if(r.next_question){
      setQuestion(r.next_question);
      setSession(prev=>({...prev, current_difficulty: r.current_difficulty}));
      setSelected(null); setTimeStart(Date.now());
    } else {
      setQuestion(null);
    }
    loadPerf();
  };
  return (
    <div style={{background:"var(--bg)", minHeight:"100vh"}}>
      <div style={{background:"var(--bg-card)", borderBottom:"1px solid var(--border)", padding:"20px 0 12px"}}>
        <div className="container" style={{paddingTop:0, paddingBottom:0}}>
          <span style={{background:"#e0f2fe", color:"#0c4a6e", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:800}}>ADAPTIVE QUIZ</span>
          <h1 style={{fontSize:"1.6rem", marginTop:8}}>Adaptive Practice</h1>
          <p style={{color:"var(--text-muted)"}}>Difficulty adjusts deterministically based on your accuracy, streak and speed - no AI guessing.</p>
          {perf && (
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:10, marginTop:12}}>
              <div className="card" style={{padding:10, textAlign:"center"}}><div style={{fontSize:11, color:"var(--text-muted)", fontWeight:700}}>CURRENT LEVEL</div><div style={{fontWeight:800, color:"#0f4c81"}}>{perf.current_difficulty || "Medium"}</div></div>
              <div className="card" style={{padding:10, textAlign:"center"}}><div style={{fontSize:11, color:"var(--text-muted)", fontWeight:700}}>ACCURACY</div><div style={{fontWeight:800}}>{perf.accuracy ?? 0}%</div></div>
              <div className="card" style={{padding:10, textAlign:"center"}}><div style={{fontSize:11, color:"var(--text-muted)", fontWeight:700}}>STREAK</div><div style={{fontWeight:800}}>{(perf.correct_streak||0) - (perf.wrong_streak||0)}</div></div>
              <div className="card" style={{padding:10, textAlign:"center"}}><div style={{fontSize:11, color:"var(--text-muted)", fontWeight:700}}>AVG TIME</div><div style={{fontWeight:800}}>{perf.average_time ?? 0}s</div></div>
            </div>
          )}
        </div>
      </div>
      <div className="container" style={{paddingTop:16, maxWidth:700}}>
        {!session ? (
          <div className="card" style={{textAlign:"center", padding:24}}>
            <div style={{fontSize:40}}>ðŸŽ¯</div>
            <h3>Ready for adaptive challenge?</h3>
            <p style={{color:"var(--text-muted)"}}>Start Easy. 3-5 correct in a row will push you to Medium -> Hard. Wrong answers step you down gently.</p>
            <button className="btn-primary" style={{marginTop:12}} onClick={start} disabled={loading}>{loading?"Starting...":"Start Adaptive Quiz ->"}</button>
          </div>
        ) : !question ? (
          <div className="card" style={{textAlign:"center", padding:24}}><h3>{msg || "Completed!"}</h3><button className="btn-primary" style={{marginTop:10}} onClick={start}>Start New Session</button></div>
        ) : (
          <div className="card">
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <span style={{fontSize:11, background:"#dbeafe", color:"#1e40af", padding:"4px 8px", borderRadius:999, fontWeight:700}}>{session.current_difficulty}</span>
              <span style={{fontSize:12, color:"var(--text-muted)"}}>Streak: {perf?.correct_streak||0} | Accuracy: {perf?.accuracy||0}%</span>
            </div>
            <div style={{marginTop:12, fontWeight:700}}>{question.text}</div>
            <div style={{fontSize:12, color:"var(--text-muted)"}}>{question.subject} | {question.topic} | {question.difficulty}</div>
            <div style={{marginTop:12, display:"grid", gap:8}}>
              {question.options.map((o,i)=>(
                <div key={i} onClick={()=>setSelected(i)} className={`quiz-option ${selected===i?"selected":""}`} style={{cursor:"pointer"}}>{String.fromCharCode(65+i)}. {o}</div>
              ))}
            </div>
            <button className="btn-primary" style={{marginTop:12, width:"100%"}} onClick={submit} disabled={selected===null}>Submit</button>
            {msg && <div style={{marginTop:10, padding:"8px 10px", borderRadius:8, background: msg.includes("increased")?"#dcfce7":"#f1f5f9", fontSize:12}}>{msg}</div>}
          </div>
        )}
      </div>
    </div>
  );
}


