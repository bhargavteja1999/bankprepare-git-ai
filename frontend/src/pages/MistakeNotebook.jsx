import { useEffect, useState } from "react";
import { getMistakes, getMistakeStats, updateMistake, deleteMistake, getPracticeQuiz } from "../services/mistakeApi";

export default function MistakeNotebook(){
  const [mistakes,setMistakes]=useState([]);
  const [stats,setStats]=useState(null);
  const [filter,setFilter]=useState({subject:"", difficulty:"", reviewed:"", important:""});
  const [loading,setLoading]=useState(true);
  const [practice,setPractice]=useState(null);
  const [noteEdit,setNoteEdit]=useState({});
  const load=async()=>{
    setLoading(true);
    try{
      const params={};
      if(filter.subject) params.subject=filter.subject;
      if(filter.difficulty) params.difficulty=filter.difficulty;
      if(filter.reviewed==="true") params.reviewed=true;
      if(filter.reviewed==="false") params.reviewed=false;
      if(filter.important==="true") params.important=true;
      const data=await getMistakes(params);
      setMistakes(Array.isArray(data)?data:[]);
      const s=await getMistakeStats(); setStats(s);
    }catch(e){ console.error(e); }
    finally{ setLoading(false); }
  };
  useEffect(()=>{ load(); },[filter.subject, filter.difficulty, filter.reviewed, filter.important]);
  const toggle = async(id, field)=>{
    const m=mistakes.find(x=>x.id===id);
    if(!m) return;
    const upd={}; upd[field]=!m[field];
    await updateMistake(id, upd);
    load();
  };
  const saveNote=async(id)=>{
    await updateMistake(id, {personal_note: noteEdit[id]||""});
    load();
  };
  const startPractice=async()=>{
    try{ const q=await getPracticeQuiz({limit:10}); setPractice(q); }catch(e){ alert(e.response?.data?.detail||"No mistakes to practice"); }
  };
  const remove=async(id)=>{
    if(!confirm("Remove this mistake? Requires confirmation.")) return;
    await deleteMistake(id); load();
  };
  if(loading) return <div className="container" style={{padding:24}}><div className="skeleton" style={{height:120, borderRadius:14}}></div></div>;
  return (
    <div style={{background:"var(--bg)", minHeight:"100vh"}}>
      <div style={{background:"var(--bg-card)", borderBottom:"1px solid var(--border)", padding:"20px 0 12px"}}>
        <div className="container" style={{paddingTop:0, paddingBottom:0}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap"}}>
            <div>
              <span style={{background:"#fee2e2", color:"#991b1b", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:800}}>MISTAKE NOTEBOOK</span>
              <h1 style={{fontSize:"1.6rem", marginTop:8}}>Your Mistakes</h1>
              <p style={{color:"var(--text-muted)", fontSize:"0.92rem"}}>Auto-saved from every incorrect answer. Review to turn weaknesses into strengths.</p>
            </div>
            <button className="btn-primary" onClick={startPractice}>Practice Mistakes -></button>
          </div>
          {stats && (
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginTop:14}}>
              <div className="card" style={{padding:12, textAlign:"center"}}><div style={{fontSize:11, color:"var(--text-muted)", fontWeight:700}}>TOTAL</div><div style={{fontWeight:800, fontSize:"1.2rem"}}>{stats.total}</div></div>
              <div className="card" style={{padding:12, textAlign:"center"}}><div style={{fontSize:11, color:"var(--text-muted)", fontWeight:700}}>UNREVIEWED</div><div style={{fontWeight:800, color:"#d97706"}}>{stats.unreviewed}</div></div>
              <div className="card" style={{padding:12, textAlign:"center"}}><div style={{fontSize:11, color:"var(--text-muted)", fontWeight:700}}>IMPORTANT</div><div style={{fontWeight:800, color:"#dc2626"}}>{stats.important}</div></div>
              <div className="card" style={{padding:12, textAlign:"center"}}><div style={{fontSize:11, color:"var(--text-muted)", fontWeight:700}}>FREQUENT (‰¥3)</div><div style={{fontWeight:800, color:"#991b1b"}}>{stats.frequently_wrong}</div></div>
              <div className="card" style={{padding:12, textAlign:"center"}}><div style={{fontSize:11, color:"var(--text-muted)", fontWeight:700}}>RECENT (7d)</div><div style={{fontWeight:800}}>{stats.recently_added}</div></div>
            </div>
          )}
          <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
            <select value={filter.subject} onChange={e=>setFilter({...filter, subject:e.target.value})} className="field-input" style={{width:160}}><option value="">All Subjects</option><option>Quants</option><option>Reasoning</option><option>English</option></select>
            <select value={filter.difficulty} onChange={e=>setFilter({...filter, difficulty:e.target.value})} className="field-input" style={{width:140}}><option value="">All Difficulty</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
            <select value={filter.reviewed} onChange={e=>setFilter({...filter, reviewed:e.target.value})} className="field-input" style={{width:150}}><option value="">All Reviewed</option><option value="false">Unreviewed</option><option value="true">Reviewed</option></select>
            <select value={filter.important} onChange={e=>setFilter({...filter, important:e.target.value})} className="field-input" style={{width:140}}><option value="">All</option><option value="true">Important</option></select>
          </div>
        </div>
      </div>
      <div className="container" style={{paddingTop:16}}>
        {practice && (
          <div className="card" style={{border:"2px solid #0f4c81", marginBottom:16}}>
            <h3>Practice Mistakes - {practice.questions.length} Qs</h3>
            <div style={{marginTop:10, display:"grid", gap:10}}>
              {practice.questions.map(q=>(
                <div key={q.id} style={{border:"1px solid var(--border)", borderRadius:10, padding:10}}>
                  <div style={{fontWeight:600}}>{q.text}</div>
                  <div style={{fontSize:12, color:"var(--text-muted)"}}>{q.subject} | {q.topic} | {q.difficulty} | mistakes: {q.mistake_count}</div>
                </div>
              ))}
            </div>
            <button className="btn-outline" style={{marginTop:10}} onClick={()=>setPractice(null)}>Close</button>
          </div>
        )}
        {mistakes.length===0 ? (
          <div className="card" style={{textAlign:"center", padding:32}}><div style={{fontSize:36}}>ðŸ§ </div><h3>No mistakes yet</h3><p style={{color:"var(--text-muted)"}}>When you answer incorrectly in Practice/Mocks, they|™ll appear here automatically.</p></div>
        ) : (
          <div style={{display:"grid", gap:12}}>
            {mistakes.map(m=>(
              <div key={m.id} className="card" style={{padding:14}}>
                <div style={{display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap"}}>
                  <span style={{fontSize:11, background:"#f1f5f9", padding:"3px 8px", borderRadius:999, fontWeight:700}}>{m.subject} | {m.topic} | {m.difficulty}</span>
                  <span style={{fontSize:11, background:m.mistake_count>=3?"#fee2e2":"#f1f5f9", color: m.mistake_count>=3?"#991b1b":"#475569", padding:"3px 8px", borderRadius:999}}>Mistakes: {m.mistake_count} | {new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{fontWeight:700, marginTop:8}}>{m.question?.text}</div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8}}>
                  <div style={{background:"#fee2e2", border:"1px solid #fecaca", padding:"8px 10px", borderRadius:8}}><div style={{fontSize:11, fontWeight:700, color:"#991b1b"}}>My Answer</div><div style={{fontSize:13}}>{m.question?.options?.[m.selected_answer] ?? m.selected_answer}</div></div>
                  <div style={{background:"#dcfce7", border:"1px solid #bbf7d0", padding:"8px 10px", borderRadius:8}}><div style={{fontSize:11, fontWeight:700, color:"#166534"}}>Correct</div><div style={{fontSize:13}}>{m.question?.options?.[m.correct_answer] ?? m.correct_answer}</div></div>
                </div>
                <div style={{background:"var(--bg)", border:"1px solid var(--border)", padding:"8px 10px", borderRadius:8, marginTop:8, fontSize:12}}><strong>Explanation:</strong> {m.question?.explanation || "-"}</div>
                <div style={{display:"flex", gap:6, marginTop:10, flexWrap:"wrap"}}>
                  <button className={m.is_reviewed?"btn-primary":"btn-outline"} style={{padding:"6px 10px", fontSize:12}} onClick={()=>toggle(m.id,"is_reviewed")}>{m.is_reviewed?"œ“ Reviewed":"Mark Reviewed"}</button>
                  <button className={m.is_important?"btn-primary":"btn-outline"} style={{padding:"6px 10px", fontSize:12, background: m.is_important?"#fef3c7":"", borderColor: m.is_important?"#fde68a":""}} onClick={()=>toggle(m.id,"is_important")}>{m.is_important?"˜… Important":"Mark Important"}</button>
                  <button className={m.is_fixed?"btn-primary":"btn-outline"} style={{padding:"6px 10px", fontSize:12}} onClick={()=>toggle(m.id,"is_fixed")}>{m.is_fixed?"œ“ Fixed":"Mark Fixed"}</button>
                  <button className="btn-outline" style={{padding:"6px 10px", fontSize:12, color:"#dc2626", borderColor:"#fecaca"}} onClick={()=>remove(m.id)}>Remove</button>
                </div>
                <div style={{marginTop:10, display:"flex", gap:6}}>
                  <input placeholder="Add personal note..." value={noteEdit[m.id] ?? m.personal_note ?? ""} onChange={e=> setNoteEdit({...noteEdit, [m.id]: e.target.value})} style={{flex:1, padding:"8px 10px", border:"1px solid #cbd5e1", borderRadius:8, fontSize:12}}/>
                  <button className="btn-outline" style={{padding:"6px 10px", fontSize:12}} onClick={()=>saveNote(m.id)}>Save Note</button>
                </div>
                {m.personal_note && <div style={{marginTop:6, fontSize:12, background:"#fffbeb", border:"1px solid #fde68a", padding:"6px 8px", borderRadius:8}}>ðŸ“ {m.personal_note}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

