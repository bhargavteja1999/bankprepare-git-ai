import { useEffect, useState } from "react";
import { getCurrentTournament, getTournament, submitTournament, getTournamentLeaderboard, getTournamentHistory } from "../services/tournamentApi";

export default function WeeklyTournament(){
  const [current,setCurrent]=useState(null);
  const [history,setHistory]=useState([]);
  const [leaderboard,setLeaderboard]=useState([]);
  const [active,setActive]=useState(null);
  const [answers,setAnswers]=useState({});
  const [timeStart,setTimeStart]=useState(0);
  const load=async()=>{
    try{
      const c=await getCurrentTournament(); setCurrent(c);
      const h=await getTournamentHistory(5); setHistory(h);
      if(c?.tournament?.id){
        const lb=await getTournamentLeaderboard(c.tournament.id); setLeaderboard(lb);
      }
    }catch(e){ console.error(e); }
  };
  useEffect(()=>{ load(); },[]);
  const start=async()=>{
    if(!current?.tournament?.id) return;
    const data=await getTournament(current.tournament.id);
    setActive(data);
    setAnswers({});
    setTimeStart(Date.now());
  };
  const submit=async()=>{
    const payload={answers: active.questions.map((_,i)=> answers[i]!==undefined? answers[i]: -1), time_taken: (Date.now()-timeStart)/1000};
    const r=await submitTournament(active.tournament.id, payload);
    alert(`Score ${r.score} | Rank #${r.rank} | XP ${r.xp} | Badges: ${r.badges.join(", ")}`);
    setActive(null); load();
  };
  if(active){
    return (
      <div className="container" style={{maxWidth:760}}>
        <h2>{active.tournament.title}</h2>
        <p style={{color:"var(--text-muted)"}}>{active.tournament.duration_minutes} min | {active.questions.length} Qs | Negative -0.25</p>
        <div style={{marginTop:12, display:"grid", gap:10}}>
          {active.questions.map((q,i)=>(
            <div key={q.id} className="card">
              <div style={{fontWeight:700}}>Q{i+1}. {q.text}</div>
              <div style={{fontSize:12, color:"var(--text-muted)"}}>{q.subject} | {q.topic}</div>
              <div style={{marginTop:8, display:"grid", gap:6}}>
                {q.options.map((o,oi)=>(
                  <div key={oi} onClick={()=> setAnswers(a=>({...a,[i]:oi}))} style={{padding:"8px 10px", borderRadius:8, border: answers[i]===oi?"2px solid #0f4c81":"1px solid #e2e8f0", background: answers[i]===oi?"#eff6ff":"#fff", cursor:"pointer"}}>{String.fromCharCode(65+oi)}. {o}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{marginTop:12, width:"100%"}} onClick={submit}>Submit Tournament (one attempt)</button>
        <button className="btn-outline" style={{marginTop:8}} onClick={()=>setActive(null)}>Exit</button>
      </div>
    );
  }
  return (
    <div style={{background:"var(--bg)", minHeight:"100vh"}}>
      <div style={{background:"var(--bg-card)", borderBottom:"1px solid var(--border)", padding:"20px 0 12px"}}>
        <div className="container" style={{paddingTop:0, paddingBottom:0}}>
          <span style={{background:"#fef3c7", color:"#92400e", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:800}}>WEEKLY TOURNAMENT</span>
          <h1 style={{fontSize:"1.6rem", marginTop:8}}>Weekly Challenge</h1>
          <p style={{color:"var(--text-muted)"}}>Same 50 Qs for everyone | Backend scoring with negative marking | One attempt | XP rewards</p>
        </div>
      </div>
      <div className="container" style={{paddingTop:16}}>
        {current?.tournament && (
          <div className="card" style={{borderLeft:"4px solid #0f4c81"}}>
            <h3>{current.tournament.title}</h3>
            <p style={{color:"var(--text-muted)"}}>{current.tournament.start_date} -> {current.tournament.end_date} | {current.tournament.duration_minutes} min | {current.tournament.total_questions} Qs | {current.tournament.status}</p>
            {current.my_attempt ? (
              <div style={{marginTop:10, background:"#f0fdf4", border:"1px solid #bbf7d0", padding:10, borderRadius:8}}>
                <div style={{fontWeight:700}}>Your Score: {current.my_attempt.score} | Rank #{current.my_attempt.rank} | Accuracy {current.my_attempt.accuracy}% | XP {current.my_attempt.xp}</div>
                <div style={{fontSize:12, color:"var(--text-muted)"}}>You have already submitted - one attempt per tournament.</div>
              </div>
            ) : (
              <button className="btn-primary" style={{marginTop:10}} onClick={start}>Start Tournament -></button>
            )}
            <div style={{marginTop:8, fontSize:12, color:"var(--text-muted)"}}>Rewards: 1st 1000 XP | 2nd 750 | 3rd 500 | Top10 250 | Participation 50</div>
          </div>
        )}
        <div className="card" style={{marginTop:16}}>
          <h3>Leaderboard - Top 10</h3>
          <div style={{marginTop:10, overflowX:"auto"}}>
            <table style={{width:"100%", fontSize:13, borderCollapse:"collapse"}}>
              <thead><tr style={{background:"var(--bg)"}}><th style={{padding:"8px", textAlign:"left", borderBottom:"1px solid var(--border)"}}>Rank</th><th style={{padding:"8px", textAlign:"left", borderBottom:"1px solid var(--border)"}}>Student</th><th style={{padding:"8px", textAlign:"right", borderBottom:"1px solid var(--border)"}}>Score</th><th style={{padding:"8px", textAlign:"right", borderBottom:"1px solid var(--border)"}}>Accuracy</th><th style={{padding:"8px", textAlign:"right", borderBottom:"1px solid var(--border)"}}>Time</th></tr></thead>
              <tbody>
                {leaderboard.length===0? <tr><td colSpan={5} style={{padding:"12px", textAlign:"center", color:"var(--text-muted)"}}>No submissions yet - be the first!</td></tr> :
                leaderboard.map(r=>(
                  <tr key={r.rank} style={{borderBottom:"1px solid #f1f5f9"}}>
                    <td style={{padding:"8px"}}>#{r.rank}</td><td style={{padding:"8px"}}>{r.username}</td><td style={{padding:"8px", textAlign:"right"}}>{r.score}</td><td style={{padding:"8px", textAlign:"right"}}>{r.accuracy}%</td><td style={{padding:"8px", textAlign:"right"}}>{Math.round(r.time_taken)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card" style={{marginTop:16}}>
          <h3>Tournament History</h3>
          <div style={{marginTop:10, display:"grid", gap:8}}>
            {history.map(h=>(
              <div key={h.id} style={{border:"1px solid var(--border)", borderRadius:8, padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div><div style={{fontWeight:600}}>{h.title}</div><div style={{fontSize:12, color:"var(--text-muted)"}}>{h.start_date} -> {h.end_date} | {h.status}</div></div>
                <div style={{fontSize:12, textAlign:"right"}}>{h.my_score!==null?`You: ${h.my_score} (#${h.my_rank})`:"Not participated"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

