import { useEffect, useState } from "react";
import { getProgress, getLeaderboard } from "../services/progressApi";
import { getSyllabus } from "../services/examApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Progress(){
  const [progress, setProgress] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [lb, setLb] = useState([]);
  const [mistakeStats, setMistakeStats] = useState(null);
  useEffect(()=>{
    getProgress().then(setProgress).catch(()=>{});
    getSyllabus().then(setSyllabus).catch(()=>{});
    getLeaderboard().then(setLb).catch(()=>{});
    import("../services/mistakeApi").then(m=> m.getMistakeStats().then(setMistakeStats).catch(()=>{}));
  },[]);
  if(!progress) return <div className="container"><div className="skeleton" style={{height:160, borderRadius:16}}></div></div>;

  const meRank = lb.find(x=>x.is_you);
  const subjectData = syllabus ? syllabus.map(s=>({ name: s.subject.split(" ")[0], progress: s.overall, full: s.subject })) : [
    { name: "Quants", progress: progress.syllabus_covered },
    { name: "Reasoning", progress: 45 },
    { name: "English", progress: 30 },
  ];
  const weak = progress.weak_topics || [];
  const mastery = syllabus ? syllabus.flatMap(s=> s.topics.map(t=>({ subject: s.subject, ...t }))) : [];

  return (
    <div className="container">
      {/* Header - distinct from Dashboard */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap"}}>
        <div>
          <span className="badge badge-success">ANALYTICS | HISTORICAL PROGRESS</span>
          <h2 style={{marginTop:8, fontSize:"1.6rem"}}>Your Progress Analytics</h2>
          <p style={{color:"var(--text-muted)", marginTop:4, fontSize:13}}>Deep dive into mastery, accuracy and consistency — not just what to do today, but how far you've come.</p>
        </div>
        <div className="card" style={{padding:"10px 14px", minWidth:160, textAlign:"center"}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:"0.06em", color:"var(--text-faint)"}}>OVERALL RANK</div>
          <div style={{fontWeight:800, fontSize:"1.4rem", color:"var(--primary)"}}>#{meRank?.rank || 342}</div>
          <div style={{fontSize:11, color:"var(--text-muted)"}}>{progress.xp} XP | {progress.streak} day streak</div>
        </div>
      </div>

      {/* KPI Grid - different metrics than Dashboard */}
      <div className="stat-grid" style={{marginTop:16}}>
        <div className="stat">
          <div style={{fontSize:11, fontWeight:800, color:"var(--text-faint)", letterSpacing:"0.06em"}}>SYLLABUS MASTERY</div>
          <strong style={{marginTop:6}}>{progress.syllabus_covered}%</strong>
          <div className="progress-track" style={{marginTop:8}}><div className="progress-fill" style={{width:`${progress.syllabus_covered}%`}}></div></div>
          <div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>Across {(syllabus||[]).length || 3} subjects</div>
        </div>
        <div className="stat">
          <div style={{fontSize:11, fontWeight:800, color:"var(--text-faint)", letterSpacing:"0.06em"}}>QUESTIONS SOLVED</div>
          <strong style={{marginTop:6}}>{progress.questions_solved.toLocaleString()}</strong>
          <div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>Lifetime | Accuracy {progress.accuracy}%</div>
        </div>
        <div className="stat">
          <div style={{fontSize:11, fontWeight:800, color:"var(--text-faint)", letterSpacing:"0.06em"}}>ACCURACY TREND</div>
          <strong style={{marginTop:6, color: progress.accuracy>=70 ? "var(--success)" : progress.accuracy>=50 ? "var(--warning)" : "var(--danger)"}}>{progress.accuracy}%</strong>
          <div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>{mistakeStats ? `${mistakeStats.frequently_wrong} frequent mistakes` : "Strong"}</div>
        </div>
        <div className="stat">
          <div style={{fontSize:11, fontWeight:800, color:"var(--text-faint)", letterSpacing:"0.06em"}}>CONSISTENCY</div>
          <strong style={{marginTop:6}}>{progress.streak} days</strong>
          <div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>{progress.xp} XP total | Keep streak</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{display:"grid", gridTemplateColumns:"1.4fr 0.9fr", gap:16, marginTop:16}}>
        <div className="card">
          <h3 style={{fontSize:"0.95rem"}}>Subject Mastery (%) <span className="badge" style={{marginLeft:8}}>Recharts</span></h3>
          <div style={{height:220, marginTop:12}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} layout="vertical" margin={{left:10, right:20}}>
                <XAxis type="number" domain={[0,100]} tick={{fontSize:11, fill:"var(--text-muted)"}} axisLine={false} tickLine={false}/>
                <YAxis dataKey="name" type="category" tick={{fontSize:12, fill:"var(--text)", fontWeight:600}} axisLine={false} tickLine={false} width={80}/>
                <Tooltip contentStyle={{background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:10, color:"var(--text)"}} formatter={(v)=>[`${v}%`, "Mastery"]}/>
                <Bar dataKey="progress" radius={[0,10,10,0]} barSize={18}>
                  {subjectData.map((e,i)=> <Cell key={i} fill={e.progress>=70 ? "#22C55E" : e.progress>=45 ? "#4F46E5" : "#F59E0B"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{fontSize:11, color:"var(--text-muted)", marginTop:8}}>Green &gt;70% mastered | Indigo 45-70% | Amber &lt;45% needs focus</div>
        </div>

        <div className="card">
          <h3 style={{fontSize:"0.95rem"}}>History vs Dashboard</h3>
          <div style={{marginTop:12, display:"grid", gap:10}}>
            <div style={{padding:10, background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:10}}>
              <div style={{fontSize:11, fontWeight:800, color:"var(--text-faint)"}}>DASHBOARD FOCUSES ON</div>
              <div style={{fontSize:13, marginTop:4, color:"var(--text)"}}>What to study <b>today</b> — tasks, weak areas, revision due</div>
            </div>
            <div style={{padding:10, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.18)", borderRadius:10}}>
              <div style={{fontSize:11, fontWeight:800, color:"#22C55E"}}>PROGRESS SHOWS</div>
              <div style={{fontSize:13, marginTop:4}}>How far you've come — mastery, accuracy, consistency over time</div>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:4}}>
              <div style={{textAlign:"center", padding:10, background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:10}}>
                <div style={{fontWeight:800, fontSize:"1.2rem"}}>{progress.accuracy}%</div><div style={{fontSize:11, color:"var(--text-muted)"}}>Avg Accuracy</div>
              </div>
              <div style={{textAlign:"center", padding:10, background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:10}}>
                <div style={{fontWeight:800, fontSize:"1.2rem"}}>{mistakeStats?.total ?? 0}</div><div style={{fontSize:11, color:"var(--text-muted)"}}>Mistakes logged</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus deep dive - distinct */}
      {syllabus && (
        <div className="card" style={{marginTop:16}}>
          <h3 style={{fontSize:"0.95rem"}}>Topic-wise Mastery</h3>
          <p style={{fontSize:12, color:"var(--text-muted)", marginTop:4}}>Breakdown by subject and topic — shows real gaps, not just overall %</p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:12, marginTop:12}}>
            {syllabus.map(s=>(
              <div key={s.subject} style={{background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:12, padding:12}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div style={{fontWeight:700, fontSize:13}}>{s.subject}</div>
                  <span style={{fontSize:11, fontWeight:800, padding:"3px 8px", borderRadius:999, background: s.overall>=70?"rgba(34,197,94,0.12)": s.overall>=40?"rgba(79,70,229,0.12)":"rgba(245,158,11,0.12)", color: s.overall>=70?"#86EFAC": s.overall>=40?"#A5B4FC":"#FCD34D", border:"1px solid var(--border)"}}>{s.overall}%</span>
                </div>
                <div className="progress-track" style={{marginTop:8}}><div className="progress-fill" style={{width:`${s.overall}%`, background: s.overall>=70?"#22C55E": s.overall>=40?"#4F46E5":"#F59E0B"}}></div></div>
                <div style={{marginTop:10, display:"grid", gap:6}}>
                  {s.topics.map(t=>(
                    <div key={t.name} style={{display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12}}>
                      <span style={{color:"var(--text-muted)"}}>{t.progress>=80?"✓":t.progress>=50?"~":"!"} {t.name}</span>
                      <span style={{fontWeight:700, color: t.progress>=80?"#86EFAC": t.progress>=50?"var(--text)":"#FCD34D"}}>{t.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weak areas vs Dashboard's quick list */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:16}}>
        <div className="card">
          <h3 style={{fontSize:"0.95rem"}}>Weak Areas — Detailed</h3>
          <p style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>Sorted by lowest accuracy — tackle these to lift overall score</p>
          <div style={{marginTop:10, display:"grid", gap:8}}>
            {weak.length===0 ? <div style={{fontSize:12, color:"var(--text-muted)", padding:10, background:"var(--bg-elevated)", borderRadius:10, border:"1px dashed var(--border)"}}>No weak topics yet — keep practicing!</div> :
              weak.map((w,i)=>(
                <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:10}}>
                  <span style={{fontSize:13, fontWeight:600}}>{w}</span>
                  <span style={{fontSize:11, background:"var(--bg-card)", border:"1px solid var(--border)", padding:"3px 8px", borderRadius:999}}>Focus</span>
                </div>
              ))
            }
          </div>
        </div>
        <div className="card">
          <h3 style={{fontSize:"0.95rem"}}>Mistake Analytics</h3>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10}}>
            <div style={{textAlign:"center", padding:12, background:"var(--bg-elevated)", borderRadius:10, border:"1px solid var(--border)"}}>
              <div style={{fontSize:11, color:"var(--text-faint)", fontWeight:700}}>TOTAL MISTAKES</div><div style={{fontWeight:800, fontSize:"1.3rem", marginTop:4}}>{mistakeStats?.total ?? 0}</div>
            </div>
            <div style={{textAlign:"center", padding:12, background:"rgba(239,68,68,0.06)", borderRadius:10, border:"1px solid rgba(239,68,68,0.15)"}}>
              <div style={{fontSize:11, color:"var(--text-faint)", fontWeight:700}}>FREQUENT (&gt;=3)</div><div style={{fontWeight:800, fontSize:"1.3rem", color:"var(--danger)", marginTop:4}}>{mistakeStats?.frequently_wrong ?? 0}</div>
            </div>
            <div style={{textAlign:"center", padding:12, background:"var(--bg-elevated)", borderRadius:10, border:"1px solid var(--border)"}}>
              <div style={{fontSize:11, color:"var(--text-faint)", fontWeight:700}}>UNREVIEWED</div><div style={{fontWeight:800, fontSize:"1.2rem", marginTop:4}}>{mistakeStats?.unreviewed ?? 0}</div>
            </div>
            <div style={{textAlign:"center", padding:12, background:"var(--bg-elevated)", borderRadius:10, border:"1px solid var(--border)"}}>
              <div style={{fontSize:11, color:"var(--text-faint)", fontWeight:700}}>IMPORTANT</div><div style={{fontWeight:800, fontSize:"1.2rem", marginTop:4}}>{mistakeStats?.important ?? 0}</div>
            </div>
          </div>
          <div style={{fontSize:11, color:"var(--text-muted)", marginTop:10}}>Dashboard shows “what to revise next”; here you see <b>history of mistakes</b> and mastery gaps.</div>
        </div>
      </div>
    </div>
  );
}
