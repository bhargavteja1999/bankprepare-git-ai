import { useEffect, useState } from "react";
import { getCA, getCACategories, getCADaily, getCAWeekly, getCAMonthly, getCAQuiz, submitCAQuiz } from "../services/currentAffairsV1Api";

export default function CurrentAffairsLearning(){
  const [category,setCategory]=useState("");
  const [categories,setCategories]=useState([]);
  const [list,setList]=useState([]);
  const [daily,setDaily]=useState(null);
  const [quiz,setQuiz]=useState([]);
  const [selected,setSelected]=useState({});
  const [quizResult,setQuizResult]=useState(null);
  const [activeTab,setActiveTab]=useState("today");
  useEffect(()=>{
    getCACategories().then(setCategories).catch(()=>{});
    refresh();
  },[category]);
  const refresh=async()=>{
    try{
      const c=await getCA({category: category||undefined, limit:12});
      setList(Array.isArray(c)?c:[]);
      const d=await getCADaily(); setDaily(d);
      const q=await getCAQuiz({category: category||undefined, limit:10}); setQuiz(Array.isArray(q)?q:[]);
    }catch(e){ console.error(e); }
  };
  const loadWeekly=async()=>{ const w=await getCAWeekly(); setList(w); setActiveTab("weekly"); };
  const loadMonthly=async(m)=>{ const mo=await getCAMonthly(m); setList(mo); setActiveTab("monthly"); };
  const submitQuiz=async()=>{
    const answers=Object.entries(selected).map(([qid, sel])=> ({question_id: parseInt(qid), selected: sel}));
    if(answers.length===0) return alert("Select answers first");
    const r=await submitCAQuiz(answers);
    setQuizResult(r);
  };
  return (
    <div style={{background:"var(--bg)", minHeight:"100vh"}}>
      <div style={{background:"var(--bg-card)", borderBottom:"1px solid var(--border)", padding:"20px 0 12px"}}>
        <div className="container" style={{paddingTop:0, paddingBottom:0}}>
          <span style={{background:"#dbeafe", color:"#1e40af", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:800}}>CURRENT AFFAIRS | VERIFIED</span>
          <h1 style={{fontSize:"1.6rem", marginTop:8}}>Current Affairs Learning System</h1>
          <p style={{color:"var(--text-muted)"}}>Banking-focused CA with verified sources - not AI-invented. Categories, daily/weekly/monthly revision & quizzes.</p>
          <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
            <select value={category} onChange={e=>setCategory(e.target.value)} className="field-input" style={{width:220}}>
              <option value="">All Categories</option>
              {categories.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <button className={activeTab==="today"?"btn-primary":"btn-outline"} style={{padding:"7px 12px", fontSize:12}} onClick={()=>{setActiveTab("today"); refresh();}}>Today</button>
            <button className={activeTab==="weekly"?"btn-primary":"btn-outline"} style={{padding:"7px 12px", fontSize:12}} onClick={loadWeekly}>Weekly</button>
            <button className={activeTab==="monthly"?"btn-primary":"btn-outline"} style={{padding:"7px 12px", fontSize:12}} onClick={()=>loadMonthly(1)}>Monthly</button>
            <button className="btn-outline" style={{padding:"7px 12px", fontSize:12}} onClick={()=>loadMonthly(3)}>3 Months</button>
          </div>
        </div>
      </div>
      <div className="container" style={{paddingTop:16}}>
        {daily && activeTab==="today" && (
          <div className="card" style={{borderLeft:"4px solid #0f4c81"}}>
            <span className="badge">TODAY'S PICK | {daily.category}</span>
            <h3 style={{marginTop:8}}>{daily.headline || daily.title}</h3>
            <p style={{color:"var(--text-muted)", marginTop:6}}>{daily.summary}</p>
            {daily.content && <p style={{fontSize:13, color:"var(--text-muted)", marginTop:6, background:"var(--bg)", padding:10, borderRadius:8}}>{daily.content.slice(0,300)}...</p>}
            <div style={{fontSize:12, color:"var(--text-muted)", marginTop:6}}>Source: {daily.source_name || daily.source} {daily.source_url && <a href={daily.source_url} target="_blank" style={{color:"#0f4c81", textDecoration:"underline"}}>Link</a>} | {daily.published_date || daily.date} | {daily.verification_status}</div>
            <div style={{fontSize:12, color:"var(--text-muted)"}}>Why it matters: {daily.tags?.join(", ") || "Banking exam relevant"}</div>
          </div>
        )}

        <div style={{display:"grid", gridTemplateColumns:"1.3fr 0.7fr", gap:16, marginTop:16}} className="ca-layout">
          <div>
            <h3>Stories {category && `- ${category}`}</h3>
            <div style={{display:"grid", gap:10, marginTop:10}}>
              {list.map(ca=>(
                <div key={ca.id} className="card" style={{padding:12}}>
                  <div style={{display:"flex", justifyContent:"space-between", gap:8}}>
                    <span style={{fontSize:11, background:"#f1f5f9", padding:"3px 8px", borderRadius:999, fontWeight:700}}>{ca.category}</span>
                    <span style={{fontSize:11, color: ca.verification_status==="verified"?"#166534":"#92400e", background: ca.verification_status==="verified"?"#dcfce7":"#fef3c7", padding:"3px 8px", borderRadius:999}}>{ca.verification_status}</span>
                  </div>
                  <div style={{fontWeight:700, marginTop:6}}>{ca.headline || ca.title}</div>
                  <div style={{fontSize:13, color:"var(--text-muted)", marginTop:4}}>{ca.summary}</div>
                  <div style={{fontSize:11, color:"var(--text-muted)", marginTop:6}}>{ca.source_name || ca.source} | {ca.published_date || ca.date} | Tags: {(ca.tags||[]).join(", ")}</div>
                </div>
              ))}
              {list.length===0 && <p style={{color:"var(--text-muted)"}}>No verified stories yet - admin must add via POST /api/v1/admin/current-affairs and verify.</p>}
            </div>
          </div>
          <div>
            <div className="card">
              <h3>Daily Quiz - {quiz.length} Qs</h3>
              <p style={{fontSize:12, color:"var(--text-muted)"}}>Generated from verified CA | Backend scoring</p>
              <div style={{marginTop:10, display:"grid", gap:10, maxHeight:500, overflowY:"auto"}}>
                {quiz.map(q=>(
                  <div key={q.id} style={{border:"1px solid var(--border)", borderRadius:8, padding:10}}>
                    <div style={{fontWeight:600, fontSize:13}}>{q.question_text}</div>
                    <div style={{fontSize:11, color:"var(--text-muted)"}}>{q.category} | {q.source}</div>
                    <div style={{marginTop:6, display:"grid", gap:4}}>
                      {q.options?.map((opt,oi)=> {
                        const letter=["A","B","C","D"][oi];
                        const sel=selected[q.id];
                        return <div key={oi} onClick={()=> setSelected(s=>({...s,[q.id]:letter}))} style={{padding:"6px 8px", borderRadius:8, border: sel===letter?"2px solid #0f4c81":"1px solid #e2e8f0", background: sel===letter?"#eff6ff":"#fff", cursor:"pointer", fontSize:12}}>{letter}. {opt}</div>;
                      })}
                    </div>
                  </div>
                ))}
                {quiz.length===0 && <p style={{fontSize:12, color:"var(--text-muted)"}}>No quiz yet - add verified CA + questions via admin.</p>}
              </div>
              <button className="btn-primary" style={{width:"100%", marginTop:10}} onClick={submitQuiz}>Submit Quiz</button>
              {quizResult && (
                <div style={{marginTop:10, background: quizResult.accuracy>=70?"#f0fdf4":"#fffbeb", border:"1px solid var(--border)", padding:10, borderRadius:8}}>
                  <div style={{fontWeight:700}}>Score: {quizResult.score} | {quizResult.correct}/{quizResult.total} | {quizResult.accuracy}%</div>
                </div>
              )}
            </div>
            <div className="card" style={{marginTop:12}}>
              <h3>Revision</h3>
              <div style={{display:"grid", gap:6, marginTop:8}}>
                <button className="btn-outline" style={{padding:"8px"}} onClick={()=>loadMonthly(1)}>Current Month</button>
                <button className="btn-outline" style={{padding:"8px"}} onClick={()=>loadMonthly(1)}>Previous Month</button>
                <button className="btn-outline" style={{padding:"8px"}} onClick={()=>loadMonthly(3)}>Last 3 Months</button>
                <button className="btn-outline" style={{padding:"8px"}} onClick={()=>loadMonthly(6)}>Last 6 Months</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

