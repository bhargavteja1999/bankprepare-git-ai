import { useState, useEffect } from "react";
import api from "./services/api";
import { getExams, getSyllabus } from "./services/examApi";
import { getQuizzes, getQuestions, submitQuiz } from "./services/quizApi";
import { getProgress, getLeaderboard } from "./services/progressApi";
import { askTutor as askTutorApi } from "./services/aiApi";
import { login as loginApi } from "./services/authApi";
import { getCurrentAffairs, getTodayCA } from "./services/currentAffairsApi";
import { getMocks, startMock, submitMock } from "./services/mockApi";
import { generatePlan, getPlan } from "./services/studyPlanApi";
import { addReview, getDue, gradeReview } from "./services/reviewApi";
import { toggleBookmark, getBookmarks } from "./services/bookmarkApi";
import MistakeNotebook from "./pages/MistakeNotebook";
import AdaptiveQuiz from "./pages/AdaptiveQuiz";
import WeeklyTournament from "./pages/WeeklyTournament";
import SyllabusTree from "./components/study/SyllabusTree";
import CurrentAffairsLearning from "./pages/CurrentAffairsLearning";
import ProgressAnalytics from "./pages/Progress";
import LeaderboardPage from "./pages/Leaderboard";
import AppShell from "./components/layout/AppShell";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import { API_URL } from "./utils/constants";

// ---- Landing (premium dark) ----
function Landing({ setPage }) {
  return (
    <div className="container">
      <section className="hero" style={{padding:"28px 0 8px"}}>
        <div>
          <span className="badge">AI-POWERED BANK EXAM PREP | v4 PREMIUM</span>
          <h1>Crack <span>IBPS, SBI & RBI</span> with your personal AI coach</h1>
          <p style={{color:"var(--text-muted)", marginTop:12}}>Adaptive practice, weakness analysis, spaced revision, daily current affairs and mock tests - one premium workspace for serious aspirants.</p>
          <div style={{display:"flex", gap:10, flexWrap:"wrap", marginTop:18}}>
            <button className="btn-primary" onClick={()=>setPage("dashboard")}>Start Learning Free -></button>
            <button className="btn-outline" onClick={()=>setPage("mocks")}>Try Mock Test</button>
            <button className="btn-ghost" onClick={()=>setPage("ca")}>Today's CA</button>
          </div>
          <div className="stat-grid" style={{marginTop:20}}>
            <div className="stat"><strong>50k+</strong><span style={{fontSize:12, color:"var(--text-muted)"}}>Questions</span></div>
            <div className="stat"><strong>12k+</strong><span style={{fontSize:12, color:"var(--text-muted)"}}>Students</span></div>
            <div className="stat"><strong>98%</strong><span style={{fontSize:12, color:"var(--text-muted)"}}>Success rate</span></div>
            <div className="stat"><strong>24/7</strong><span style={{fontSize:12, color:"var(--text-muted)"}}>AI Tutor</span></div>
          </div>
        </div>
        <div className="card card-glow-ai" style={{background:"linear-gradient(135deg,#4F46E5 0%, #38BDF8 100%)", color:"#fff", border:"none", padding:18}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <h3 style={{color:"#fff", margin:0}}>⚡ Today's Focus</h3>
            <span style={{background:"rgba(255,255,255,0.18)", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:800}}>AI RECOMMENDED</span>
          </div>
          <p style={{color:"#DBEAFE", marginTop:6, fontSize:13}}>Quantitative Aptitude | Simplification | 20 Qs | 15 min</p>
          <div style={{background:"#0B1020", borderRadius:14, padding:14, marginTop:14, border:"1px solid #1E293B"}}>
            <strong style={{fontSize:14, color:"#F8FAFC"}}>Q1. What is 48% of 250?</strong>
            <div className="quiz-option" style={{background:"#FFFFFF", color:"#334155", border:"1px solid #E2E8F0"}}>A) 110</div>
            <div className="quiz-option" style={{background:"#4F46E5", color:"#FFFFFF", border:"1px solid #6366F1", fontWeight:700, boxShadow:"0 4px 12px rgba(79,70,229,0.4)"}}>B) 120 ✓ <span style={{opacity:0.9, fontWeight:500, marginLeft:6}}>| Shortcut: 50% - 2% = 125 - 5</span></div>
            <div className="quiz-option" style={{background:"#FFFFFF", color:"#334155", border:"1px solid #E2E8F0"}}>C) 130</div>
            <div className="quiz-option" style={{background:"#FFFFFF", color:"#334155", border:"1px solid #E2E8F0"}}>D) 100</div>
          </div>
          <button className="btn-outline" style={{width:"100%", marginTop:14, background:"#fff", color:"#0B1020", borderColor:"#fff"}} onClick={()=>setPage("practice")}>Continue Practice -></button>
        </div>
      </section>

      <div className="card-grid" style={{marginTop:18}}>
        <div className="card" style={{cursor:"pointer"}} onClick={()=>setPage("tutor")}><div style={{width:36,height:36,borderRadius:10,background:"rgba(79,70,229,0.15)", display:"flex",alignItems:"center",justifyContent:"center"}}>🧠</div><h3 style={{marginTop:10}}>AI Tutor</h3><p style={{color:"var(--text-muted)", fontSize:13, marginTop:4}}>Ask any doubt + image upload. Context-aware hints, shortcuts & similar Qs.</p><span className="badge" style={{marginTop:10}}>Electric Blue | Glow</span></div>
        <div className="card" style={{cursor:"pointer"}} onClick={()=>setPage("review")}><div style={{width:36,height:36,borderRadius:10,background:"rgba(34,197,94,0.12)", display:"flex",alignItems:"center",justifyContent:"center"}}>🔁</div><h3 style={{marginTop:10}}>Spaced Review (SM-2)</h3><p style={{color:"var(--text-muted)", fontSize:13, marginTop:4}}>Failed Qs auto-rescheduled 1/3/7/14/30 days. Due queue synced.</p><span className="badge badge-success" style={{marginTop:10}}>Progress | Green</span></div>
        <div className="card" style={{cursor:"pointer"}} onClick={()=>setPage("mocks")}><div style={{width:36,height:36,borderRadius:10,background:"rgba(124,58,237,0.15)", display:"flex",alignItems:"center",justifyContent:"center"}}>🎯</div><h3 style={{marginTop:10}}>Mock Tests</h3><p style={{color:"var(--text-muted)", fontSize:13, marginTop:4}}>Full mocks with sectional timer, -0.25 negative, rank prediction.</p><span className="badge" style={{marginTop:10, background:"rgba(124,58,237,0.15)", color:"#C4B5FD", borderColor:"rgba(124,58,237,0.3)"}}>Mock | Purple</span></div>
        <div className="card" style={{cursor:"pointer"}} onClick={()=>setPage("ca")}><div style={{width:36,height:36,borderRadius:10,background:"rgba(56,189,248,0.12)", display:"flex",alignItems:"center",justifyContent:"center"}}>📰</div><h3 style={{marginTop:10}}>Current Affairs Daily</h3><p style={{color:"var(--text-muted)", fontSize:13, marginTop:4}}>PIB/RBI/SEBI digests + 10 Qs. Verified sources, no fabrication.</p><span className="badge badge-cyan" style={{marginTop:10}}>Current Affairs | Cyan</span></div>
        <div className="card" style={{cursor:"pointer"}} onClick={()=>setPage("plan")}><div style={{width:36,height:36,borderRadius:10,background:"rgba(79,70,229,0.15)", display:"flex",alignItems:"center",justifyContent:"center"}}>📅</div><h3 style={{marginTop:10}}>AI Study Plan v2</h3><p style={{color:"var(--text-muted)", fontSize:13, marginTop:4}}>Target date -> 30/60/90 phases, daily tasks tracked in DB.</p></div>
        <div className="card" style={{cursor:"pointer"}} onClick={()=>setPage("syllabus")}><div style={{width:36,height:36,borderRadius:10,background:"rgba(245,158,11,0.12)", display:"flex",alignItems:"center",justifyContent:"center"}}>🗺️</div><h3 style={{marginTop:10}}>Syllabus + Bookmarks</h3><p style={{color:"var(--text-muted)", fontSize:13, marginTop:4}}>Topic-wise progress + bookmark starred Qs & notes.</p></div>
      </div>
    </div>
  );
}

// ---- Premium Dashboard: WHAT SHOULD I STUDY TODAY? ----
function Dashboard({ setPage }) {
  const [progress, setProgress] = useState(null);
  const [exams, setExams] = useState([]);
  const [lb, setLb] = useState([]);
  const [mistakeStats, setMistakeStats] = useState(null);
  const [due, setDue] = useState([]);
  const [syllabus, setSyllabus] = useState(null);
  useEffect(()=>{
    getProgress().then(setProgress).catch(()=>{});
    getExams().then(setExams).catch(()=>{});
    getLeaderboard().then(setLb).catch(()=>{});
    getSyllabus().then(setSyllabus).catch(()=>{});
    import("./services/mistakeApi").then(m=> m.getMistakeStats().then(setMistakeStats).catch(()=>{}));
    getDue().then(setDue).catch(()=>setDue([]));
  },[]);
  if(!progress) return <div className="container"><div className="skeleton" style={{height:120, borderRadius:16}}></div></div>;
  const meRank = lb.find(x=>x.is_you);
  const weak = progress.weak_topics || [];
  const todayPlan = [
    {icon:"📐", title:"Simplification - 20 Qs", meta:"Quants | 30 min | Medium", cta:"Practice ->", page:"practice"},
    {icon:"🧩", title:"Puzzles - Level 2", meta:"Reasoning | 45 min | Weak area", cta:"Adaptive ->", page:"adaptive"},
    {icon:"📖", title:"Error Spotting - 15 Qs", meta:"English | 30 min | Fix 48% accuracy", cta:"Practice ->", page:"practice"},
    {icon:"📰", title:"Daily CA - 10 Qs", meta:"GA | 20 min | Verified RBI/SEBI", cta:"Start ->", page:"ca"},
  ];
  const upcoming = due.slice(0,3);
  return (
    <div className="container">
      {/* Header */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap"}}>
        <div>
          <h2 style={{fontSize:"1.6rem"}}>What should I study today?</h2>
          <p style={{color:"var(--text-muted)", marginTop:4, fontSize:13}}>Your personalised plan based on accuracy, difficulty, streak & weak topics - updated live from backend.</p>
        </div>
        <div className="card" style={{padding:"10px 14px", display:"flex", gap:12, alignItems:"center"}}>
          <span style={{fontSize:22}}>🔥</span>
          <div><div style={{fontWeight:800}}>{progress.streak} day streak</div><div style={{fontSize:11, color:"var(--text-muted)"}}>{progress.questions_solved.toLocaleString()} Qs solved | {progress.accuracy}% accuracy</div></div>
          <span className="badge badge-success">LIVE</span>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="stat-grid" style={{marginTop:16}}>
        <div className="stat"><div style={{fontSize:11, color:"var(--text-faint)", fontWeight:800, letterSpacing:"0.06em"}}>TODAY'S PROGRESS</div><strong style={{marginTop:6}}>{Math.min(100, Math.round(progress.syllabus_covered*0.6 + 20))}%</strong><div className="progress-track" style={{marginTop:8}}><div className="progress-fill" style={{width:`${progress.syllabus_covered}%`}}></div></div><div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>{progress.syllabus_covered}% syllabus | {progress.accuracy}% accuracy</div></div>
        <div className="stat"><div style={{fontSize:11, color:"var(--text-faint)", fontWeight:800, letterSpacing:"0.06em"}}>QUESTIONS ATTEMPTED</div><strong style={{marginTop:6}}>{progress.questions_solved}</strong><div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>+12 today | {exams.length} exams</div></div>
        <div className="stat"><div style={{fontSize:11, color:"var(--text-faint)", fontWeight:800, letterSpacing:"0.06em"}}>STREAK & XP</div><strong style={{marginTop:6}}>{progress.xp} XP</strong><div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>Rank #{meRank?.rank || 342} | Keep going!</div></div>
        <div className="stat"><div style={{fontSize:11, color:"var(--text-faint)", fontWeight:800, letterSpacing:"0.06em"}}>WEAK AREAS</div><strong style={{marginTop:6, fontSize:"1rem", lineHeight:1.2}}>{weak[0]?.split(" ")[0] || "DI"}</strong><div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>{weak.length} topics need revision</div></div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1.55fr 0.85fr", gap:16, marginTop:16}}>
        {/* Left: Today's Plan */}
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <div className="card" style={{padding:0, overflow:"hidden"}}>
            <div style={{padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid var(--border)"}}>
              <h3 style={{fontSize:"0.95rem", display:"flex", alignItems:"center", gap:8}}><span style={{width:28,height:28, borderRadius:8, background:"var(--primary)", display:"flex",alignItems:"center",justifyContent:"center", color:"#fff", fontSize:14}}>📅</span> Today's Plan | 4 tasks | ~2h</h3>
              <button className="btn-primary" style={{padding:"7px 12px", fontSize:12}} onClick={()=>setPage("plan")}>Open Study Plan -></button>
            </div>
            <div style={{padding:12}}>
              {todayPlan.map((t,i)=>(
                <div key={i} style={{display:"flex", gap:12, alignItems:"center", padding:"11px 12px", borderRadius:12, background: i===0 ? "rgba(79,70,229,0.08)" : "transparent", border: i===0 ? "1px solid rgba(79,70,229,0.2)" : "1px solid transparent", marginBottom:6}}>
                  <div style={{width:36,height:36, borderRadius:10, background:"var(--bg-elevated)", border:"1px solid var(--border)", display:"flex",alignItems:"center",justifyContent:"center"}}>{t.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700, fontSize:13}}>{t.title}</div>
                    <div style={{fontSize:11, color:"var(--text-muted)"}}>{t.meta}</div>
                  </div>
                  <button className={i===0 ? "btn-primary" : "btn-outline"} style={{padding:"6px 10px", fontSize:12}} onClick={()=>setPage(t.page)}>{t.cta}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{fontSize:"0.95rem"}}>Recommended Practice <span className="badge" style={{marginLeft:8}}>Adaptive</span></h3>
            <p style={{fontSize:12, color:"var(--text-muted)", marginTop:4}}>Based on your streak, accuracy & time - difficulty auto-adjusts.</p>
            <div style={{display:"flex", gap:8, marginTop:12}}>
              <button className="btn-primary btn-ai" onClick={()=>setPage("adaptive")}>Start Adaptive Practice -></button>
              <button className="btn-outline" onClick={()=>setPage("practice")}>Quick Practice (5 Qs)</button>
            </div>
          </div>

          <div className="card" style={{borderLeft:"3px solid #F59E0B"}}>
            <h3 style={{fontSize:"0.95rem"}}>Weak Areas <span style={{fontSize:11, color:"#F59E0B", background:"rgba(245,158,11,0.12)", padding:"2px 8px", borderRadius:999}}>via /ai/weakness-analysis</span></h3>
            <div style={{marginTop:10, display:"grid", gap:8}}>
              {weak.map((w,i)=>(
                <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 10px", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.18)", borderRadius:10}}>
                  <span style={{fontSize:13, fontWeight:600}}>| {w}</span>
                  <button className="btn-ghost" style={{fontSize:11}} onClick={()=>setPage("practice")}>Practice 5 Qs</button>
                </div>
              ))}
            </div>
            {weak.length===0 && <p style={{fontSize:12, color:"var(--text-muted)", marginTop:8}}>No weak topics yet - keep practicing!</p>}
          </div>
        </div>

        {/* Right: Upcoming Revision + Mock + Quick stats */}
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <div className="card">
            <h3 style={{fontSize:"0.9rem"}}>Upcoming Revision <span className="badge badge-warning">SM-2</span></h3>
            <p style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>{due.length} due | {mistakeStats?.unreviewed ?? 0} mistakes to review</p>
            <div style={{marginTop:10, display:"grid", gap:8}}>
              {upcoming.length===0 ? <div style={{fontSize:12, color:"var(--text-muted>", background:"var(--bg-elevated)", padding:10, borderRadius:10, border:"1px dashed var(--border)"}}>No due cards. Fail a question to schedule spaced revision.</div> : upcoming.map(d=>(
                <div key={d.review_id} style={{padding:"10px 12px", background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:10}}>
                  <div style={{fontWeight:600, fontSize:13, lineHeight:1.4}}>{d.question?.text?.slice(0,72)}…</div>
                  <div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>Interval {d.interval}d | Ease {d.ease?.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <button className="btn-outline" style={{width:"100%", marginTop:10}} onClick={()=>setPage("review")}>Open Review Queue -></button>
          </div>

          <div className="card" style={{background:"linear-gradient(135deg,#1E1B4B 0%, #0F172A 100%)", border:"1px solid rgba(79,70,229,0.25)"}}>
            <h3 style={{fontSize:"0.9rem"}}>Mock Test <span className="badge" style={{background:"rgba(124,58,237,0.2)", color:"#C4B5FD", borderColor:"rgba(124,58,237,0.3)"}}>Purple</span></h3>
            <p style={{fontSize:12, color:"var(--text-muted)", marginTop:4}}>Next recommended: Quants Daily Quiz - 10 min</p>
            <div style={{marginTop:10, display:"flex", gap:8}}>
              <button className="btn-primary" onClick={()=>setPage("mocks")}>Start Mock -></button>
              <span style={{fontSize:11, color:"var(--text-muted)", alignSelf:"center"}}>-0.25 negative | rank prediction</span>
            </div>
          </div>

          <div className="card">
            <h3 style={{fontSize:"0.9rem"}}>Leaderboard</h3>
            <div style={{marginTop:10, display:"grid", gap:6}}>
              {lb.slice(0,3).map(u=> <div key={u.rank} style={{display:"flex", justifyContent:"space-between", fontSize:13, padding:"6px 8px", background: u.is_you ? "rgba(79,70,229,0.1)" : "transparent", borderRadius:8, fontWeight: u.is_you?700:500}}><span>#{u.rank} {u.name}</span><span>{u.xp} XP</span></div>)}
            </div>
            {meRank && <div style={{marginTop:8, fontSize:12, color:"var(--accent)", fontWeight:700}}>You are Rank #{meRank.rank} - {meRank.xp} XP</div>}
            <button className="btn-ghost" style={{marginTop:8}} onClick={()=>setPage("leaderboard")}>View full leaderboard -></button>
          </div>

          <div className="card" style={{padding:12}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <h3 style={{fontSize:"0.9rem"}}>Mistake Notebook</h3>
              <span className="badge badge-warning">{mistakeStats ? `${mistakeStats.total} total` : "-"}</span>
            </div>
            <p style={{fontSize:12, color:"var(--text-muted)", marginTop:4}}>{mistakeStats ? `${mistakeStats.unreviewed} to review | ${mistakeStats.important} important` : "Wrong answers auto-saved"}</p>
            <button className="btn-outline" style={{width:"100%", marginTop:10}} onClick={()=>setPage("mistakes")}>Open Mistakes -></button>
          </div>
        </div>
      </div>

      {/* Bottom: syllabus teaser */}
      {syllabus && (
        <div className="card" style={{marginTop:16}}>
          <h3 style={{fontSize:"0.95rem"}}>Syllabus Progress</h3>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginTop:12}}>
            {syllabus.map(s=>(
              <div key={s.subject} style={{background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:12, padding:12}}>
                <div style={{fontWeight:700, fontSize:13}}>{s.subject}</div>
                <div style={{fontSize:11, color:"var(--text-muted)", marginTop:2}}>{s.topics.slice(0,2).map(t=>t.name).join(" | ")}</div>
                <div className="progress-track" style={{marginTop:8}}><div className="progress-fill" style={{width:`${s.overall}%`}}></div></div>
                <div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>{s.overall}% overall</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Practice() {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    getQuestions({limit:5}).then(qs=>{ setQuestions(qs); setLoading(false); }).catch(()=>setLoading(false));
  },[]);
  const q = questions[idx];
  const submit = async () => {
    if(selected===null || !q) return;
    try {
      const r = await api.post(`/questions/${q.id}/verify`, { selected_idx: selected });
      const isCorrect = r.data.is_correct;
      const exp = r.data.explanation || "";
      const correctIdx = r.data.correct_idx;
      const correctOpt = r.data.correct_option || (q.options[correctIdx] || "");
      setResult(isCorrect? {ok:true, text:`✅ Correct! ${exp}`} : {ok:false, text:`❌ Incorrect. Correct is ${String.fromCharCode(65+correctIdx)}) ${correctOpt} - ${exp}`});
      try { await submitQuiz({quiz_id:1, answers: [...Array(idx).fill(0), selected]}); } catch {}
    } catch (e) {
      if (q.answer_idx !== undefined) {
        const isCorrect = selected===q.answer_idx;
        setResult(isCorrect? {ok:true, text:`✅ Correct! ${q.explanation}`} : {ok:false, text:`❌ Incorrect. Correct is ${String.fromCharCode(65+q.answer_idx)}) ${q.options[q.answer_idx]} - ${q.explanation}`});
      } else {
        setResult({ok:false, text:`⚠️ Could not verify answer: ${e.message||"backend unreachable"}`});
      }
    }
  };
  const next = ()=>{ setSelected(null); setResult(null); setIdx(i=>Math.min(i+1, questions.length-1)); };
  if(loading) return <div className="container"><div className="skeleton" style={{height:260, borderRadius:16}}></div></div>;
  if(!q) return <div className="container"><div className="card" style={{textAlign:"center", padding:32}}><p style={{color:"var(--text-muted)"}}>No questions from backend.</p></div></div>;
  return (
    <div className="container" style={{maxWidth:760}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2 style={{fontSize:"1.3rem"}}>Practice <span className="badge">Indigo | Adaptive</span></h2>
        <span style={{fontSize:12, color:"var(--text-muted)"}}>GET /api/questions</span>
      </div>
      <div className="quiz-box" style={{marginTop:16}}>
        <span className="badge">Q{idx+1} / {questions.length} | {q.subject} | {q.topic} | {q.difficulty}</span>
        <h3 style={{margin:"12px 0", fontSize:"1.05rem", lineHeight:1.4}}>{q.text}</h3>
        {q.options.map((o,i)=>(
          <div key={i} className={`quiz-option ${selected===i?"selected":""}`} onClick={()=>!result && setSelected(i)}>
            <span>{String.fromCharCode(65+i)}) {o}</span>
            {selected===i && <span>●</span>}
          </div>
        ))}
        {!result ? <button className="btn-primary" style={{marginTop:14}} onClick={submit} disabled={selected===null}>Submit Answer</button>
        : <><div style={{marginTop:12, padding:12, background: result.ok?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.12)", border:`1px solid ${result.ok?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`, borderRadius:12, color: result.ok?"#86EFAC":"#FCA5A5", fontSize:13}}>{result.text}</div>
            <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
              <button className="btn-outline" onClick={async()=>{ try{ await toggleBookmark(q.id, `Marked from practice Q${q.id}`); alert("Bookmarked ★"); }catch(e){ alert("Login required for bookmarks"); } }}>★ Bookmark</button>
              <button className="btn-outline" onClick={async()=>{ try{ await addReview(q.id); alert("Added to Review queue (SM-2)"); }catch(e){ alert("Login required for review"); } }}>+ Add to Review</button>
              <button className="btn-ghost" onClick={()=>{ setSelected(null); setResult(null); }}>Clear</button>
            </div>
            {idx < questions.length-1 && <button className="btn-primary" style={{marginTop:12}} onClick={next}>Next Question -></button>}
           </>
        }
      </div>
    </div>
  );
}

function Syllabus({ setPage }){
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    setLoading(true);
    getSyllabus().then(d=>{ setData(Array.isArray(d)?d:[]); setLoading(false); }).catch(()=>setLoading(false));
  },[]);
  if(loading) return <div className="container"><h2>Syllabus Tree <span className="badge">Loading</span></h2><div className="skeleton" style={{height:160, borderRadius:16, marginTop:12}}></div></div>;
  return <div className="container">
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap"}}>
      <div>
        <h2 style={{display:"flex", gap:8, alignItems:"center"}}>Syllabus Tree <span className="badge" style={{background:"rgba(79,70,229,0.12)", color:"#A5B4FC", borderColor:"rgba(79,70,229,0.25)"}}>{data.length} Subjects</span></h2>
        <p style={{color:"var(--text-muted)", fontSize:13, marginTop:4}}>Complete banking-exam syllabus — Subject → Topic → Subtopic. Expand to practice, learn or ask AI Tutor.</p>
      </div>
      <div style={{fontSize:11, color:"var(--text-muted)", background:"var(--bg-card)", border:"1px solid var(--border)", padding:"6px 10px", borderRadius:999}}>{data.reduce((a,s)=>a+(s.topic_count||0),0)} Topics | {data.reduce((a,s)=>a+(s.subtopic_count||0),0)} Subtopics</div>
    </div>
    <div style={{marginTop:14}}>
      <SyllabusTree data={data} setPage={setPage}/>
    </div>
  </div>;
}

function Tutor() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([{role:"ai", text:"Hi! I'm your BankPrepare AI Tutor - personal exam coach. Ask any doubt from Quants, Reasoning, English or GK. Try: 'Explain Simply', 'Give Hint', 'Show Shortcut'."}]);
  const [busy, setBusy] = useState(false);
  const quickActions = ["Explain Simply","Step-by-Step","Give a Hint","Show Shortcut","Similar Question"];
  const send = async (text) => {
    const q = (text ?? input).trim();
    if(!q || busy) return;
    setMsgs(m=>[...m, {role:"user", text:q}]);
    setInput("");
    setBusy(true);
    try{
      const r = await askTutorApi(q);
      setMsgs(m=>[...m, {role:"ai", text: r.answer + ` [${r.source}]`, hint:r.hint}]);
    } catch(e){
      setMsgs(m=>[...m, {role:"ai", text: "⚠️ Backend not reachable - " + (e.message||"check /api/ai/tutor")}]);
    } finally{ setBusy(false); }
  };
  return (
    <div className="container" style={{maxWidth:760}}>
      <h2 style={{display:"flex", alignItems:"center", gap:10}}>AI Tutor <span className="badge" style={{background:"linear-gradient(135deg,#4F46E5,#38BDF8)", color:"#fff", border:"none"}}>Electric Blue | Personal Coach</span></h2>
      <p style={{fontSize:12, color:"var(--text-muted)", marginTop:4}}>Context-aware - understands your question, topic, difficulty & weak areas.</p>
      <div className="quiz-box ai-glow" style={{marginTop:14, minHeight:420, display:"flex", flexDirection:"column", background:"linear-gradient(180deg,#111827 0%, #0F172A 100%)"}}>
        <div style={{flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, maxHeight:380, paddingRight:4}}>
          {msgs.map((m,i)=>(<div key={i} style={{alignSelf: m.role==="user"?"flex-end":"flex-start", background: m.role==="user"?"linear-gradient(135deg,#4F46E5,#6366F1)":"#1A2442", color: m.role==="user"?"white":"#E2E8F0", padding:"10px 14px", borderRadius:16, maxWidth:"85%", border: m.role==="ai"?"1px solid #1E293B":"none", fontSize:13, lineHeight:1.6}}>
            <div>{m.text}</div>
            {m.hint && <div style={{marginTop:6, fontSize:11, color:"var(--accent)", background:"rgba(56,189,248,0.08)", padding:"6px 8px", borderRadius:8, border:"1px solid rgba(56,189,248,0.15)"}}>💡 {m.hint}</div>}
          </div>))}
          {busy && <div style={{alignSelf:"flex-start", background:"#1A2442", padding:"10px 14px", borderRadius:16, border:"1px solid #1E293B", fontSize:13}}>Thinking… <span className="spinner" style={{width:12,height:12, verticalAlign:"middle", marginLeft:6}}></span></div>}
        </div>
        <div style={{display:"flex", gap:6, flexWrap:"wrap", marginTop:12}}>
          {quickActions.map(a=> <button key={a} className="btn-ghost" style={{fontSize:11, padding:"6px 10px"}} onClick={()=>send(a)}>[ {a} ]</button>)}
        </div>
        <div style={{display:"flex", gap:8, marginTop:12}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask e.g., Explain syllogism shortcut..." className="field-input" style={{flex:1}} />
          <button className="btn-primary btn-ai" onClick={()=>send()} disabled={busy}>{busy?"…":"Send"}</button>
        </div>
      </div>
    </div>
  );
}

function MocksPage(){
  const [mocks,setMocks]=useState([]); const [active,setActive]=useState(null); const [answers,setAnswers]=useState({}); const [result,setResult]=useState(null);
  const [palette, setPalette]=useState({});
  useEffect(()=>{ getMocks().then(setMocks).catch(()=>{}); },[]);
  const start=async(id)=>{ const data=await startMock(id); setActive(data); setAnswers({}); setResult(null); setPalette({}); };
  const submit=async()=>{ const payload={answers: active.questions.map((q,i)=> answers[i] ?? -1)}; const r=await submitMock(active.mock_id, payload); setResult(r); };
  if(active && !result) return (
    <div className="container" style={{maxWidth:860}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12}}>
        <h2 style={{fontSize:"1.2rem"}}>{active.title} <span className="badge">{active.duration_min} min | -0.25 negative</span></h2>
        <div className="card" style={{padding:"8px 12px", display:"flex", gap:12, alignItems:"center"}}><span style={{fontWeight:800}}>⏱ {active.duration_min}:00</span><button className="btn-outline" style={{padding:"6px 10px", fontSize:12}} onClick={()=>setActive(null)}>Exit</button></div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"220px 1fr", gap:16, marginTop:16}}>
        <div className="card" style={{height:"fit-content", position:"sticky", top:76}}>
          <div style={{fontWeight:800, fontSize:12, letterSpacing:"0.06em", color:"var(--text-faint)"}}>QUESTION PALETTE</div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginTop:10}}>
            {active.questions.map((q,i)=>{
              const ans = answers[i];
              const state = ans!=null && ans!==-1 ? "answered" : palette[i]==="review" ? "review" : "not";
              const bg = state==="answered" ? "#22C55E" : state==="review" ? "#F59E0B" : "#1E293B";
              return <div key={q.id} onClick={()=>document.getElementById(`q-${i}`)?.scrollIntoView({behavior:"smooth"})} style={{height:36, borderRadius:8, background:bg, color:"#fff", display:"flex",alignItems:"center",justifyContent:"center", fontWeight:700, fontSize:13, cursor:"pointer", border: state==="review" ? "2px solid #F59E0B" : "1px solid transparent"}}>{i+1}</div>;
            })}
          </div>
          <div style={{marginTop:12, display:"grid", gap:6, fontSize:11, color:"var(--text-muted)"}}>
            <span><span style={{display:"inline-block", width:10,height:10, background:"#22C55E", borderRadius:3, marginRight:6}}></span> Answered</span>
            <span><span style={{display:"inline-block", width:10,height:10, background:"#F59E0B", borderRadius:3, marginRight:6}}></span> Marked for review</span>
            <span><span style={{display:"inline-block", width:10,height:10, background:"#1E293B", borderRadius:3, marginRight:6}}></span> Not visited</span>
          </div>
        </div>
        <div>
          {active.questions.map((q,i)=><div key={q.id} id={`q-${i}`} className="quiz-box" style={{marginBottom:12}}><div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}><strong>Q{i+1}. {q.text}</strong><button className="btn-ghost" style={{fontSize:11}} onClick={()=>setPalette(p=>({...p,[i]: p[i]==="review" ? null : "review"}))}>{palette[i]==="review" ? "Unmark" : "Mark for review"}</button></div><div style={{fontSize:12, color:"var(--text-muted)", marginTop:4}}>{q.subject} | {q.topic}</div>{q.options.map((o,oi)=><div key={oi} className={`quiz-option ${answers[i]===oi?"selected":""}`} onClick={()=>setAnswers(a=>({...a,[i]:oi}))}><span>{String.fromCharCode(65+oi)}) {o}</span></div> )}<div style={{display:"flex", gap:8, marginTop:10}}><button className="btn-ghost" onClick={()=>setAnswers(a=>{ const n={...a}; delete n[i]; return n;})}>Clear</button><button className="btn-outline" style={{marginLeft:"auto"}} onClick={()=>{
            const next = document.getElementById(`q-${Math.min(i+1, active.questions.length-1)}`);
            next?.scrollIntoView({behavior:"smooth"});
          }}>Save & Next</button></div></div>)}
          <button className="btn-primary" style={{width:"100%", marginTop:8}} onClick={submit}>Submit Mock | Calculate on backend</button>
          <button className="btn-outline" style={{width:"100%", marginTop:8}} onClick={()=>setActive(null)}>Back to list</button>
        </div>
      </div>
    </div>
  );
  if(result) return <div className="container" style={{maxWidth:760}}><div className="quiz-box"><h3>Result: {result.score} / {result.total} | {result.accuracy}%</h3><p style={{color:"var(--text-muted)", marginTop:4}}>XP +{result.xp_earned} | {result.rank_prediction}</p><div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:10}}>{Object.entries(result.sections||{}).map(([k,v])=><span key={k} className="badge">{k}: {v.score}/{v.total}</span>)}</div><button className="btn-primary" style={{marginTop:14}} onClick={()=>{setActive(null); setResult(null);}}>Back to Mocks</button></div></div>;
  return <div className="container"><h2>Mock Tests <span className="badge" style={{background:"rgba(124,58,237,0.15)", color:"#C4B5FD", borderColor:"rgba(124,58,237,0.3)"}}>Purple | Sectional & Full</span></h2><div className="card-grid" style={{marginTop:14}}>{mocks.map(m=><div key={m.id} className="card"><h3>{m.title}</h3><p style={{color:"var(--text-muted)", fontSize:13, marginTop:4}}>{m.subject} | {m.duration_min} min | {m.questions} Qs {m.negative_marking?`| -${m.negative_marking}`:""}</p><button className="btn-primary" style={{marginTop:10}} onClick={()=>start(m.id)}>Start Test -></button></div>)}</div></div>;
}

function CurrentAffairsPage(){
  const [cas,setCas]=useState([]); const [today,setToday]=useState(null);
  const [loading,setLoading]=useState(true);
  const [answers,setAnswers]=useState({});
  const [expanded,setExpanded]=useState({});
  const [activeQuiz,setActiveQuiz]=useState("today");
  useEffect(()=>{
    setLoading(true);
    Promise.all([getCurrentAffairs(6), getTodayCA()]).then(([all, t])=>{ setCas(all||[]); setToday(t); }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);
  const totalQs = cas.reduce((a,c)=> a + (c.quiz?.length||0), 0);
  const formatCAdate = (iso)=>{ try{ return new Date(iso).toLocaleDateString("en-GB",{day:"numeric", month:"short", year:"numeric"}); }catch{ return iso; } };
  const selectAns = (caId, qIdx, optIdx)=> setAnswers(p=> ({...p, [`${caId}-${qIdx}`]: optIdx}));
  const getScore = (ca)=>{
    if(!ca.quiz) return {done:0,total:0,correct:0};
    let correct=0, done=0;
    ca.quiz.forEach((q,i)=>{ const k=`${ca.id}-${i}`; if(answers[k]!==undefined){ done++; if(answers[k]===q.answer_idx) correct++; }});
    return {done,total:ca.quiz.length,correct};
  };
  if(loading) return <div className="container" style={{padding:"24px"}}><div className="skeleton" style={{height:160, borderRadius:16, marginBottom:16}}></div><div className="skeleton" style={{height:260, borderRadius:16}}></div></div>;
  const todayScore = today ? getScore(today) : {done:0,total:0,correct:0};
  return (
    <div style={{minHeight:"100vh"}}>
      <div style={{background:"var(--bg-card)", borderBottom:"1px solid var(--border)", padding:"20px 0 14px"}}>
        <div className="container" style={{paddingTop:0, paddingBottom:0}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap"}}>
            <div>
              <span className="badge badge-cyan">DAILY CURRENT AFFAIRS | BANK GA</span>
              <h1 style={{fontSize:"1.7rem", marginTop:10}}>Current Affairs</h1>
              <p style={{color:"var(--text-muted)", marginTop:6, fontSize:13, maxWidth:560}}>Stay exam-ready with daily PIB, RBI, SEBI & The Hindu digests - each story comes with 3-4 exam-style MCQs. Verified sources only.</p>
            </div>
            <div className="card" style={{minWidth:160, textAlign:"center", background:"linear-gradient(135deg,#0B1020 0%, #111827 100%)"}}>
              <div style={{fontSize:10, fontWeight:800, letterSpacing:"0.08em", color:"var(--accent)"}}>THIS WEEK</div>
              <div style={{fontWeight:800, fontSize:"1.3rem", marginTop:4}}>{cas.length} stories</div>
              <div style={{fontSize:12, color:"var(--text-muted)"}}>| {totalQs} questions</div>
              <div style={{fontSize:10, background:"rgba(56,189,248,0.12)", color:"#7DD3FC", padding:"4px 8px", borderRadius:999, display:"inline-block", marginTop:8, border:"1px solid rgba(56,189,248,0.2)"}}>Updated daily 6 AM IST | Cyan</div>
            </div>
          </div>
          <div style={{display:"flex", gap:8, marginTop:14, flexWrap:"wrap"}}>
            <button onClick={()=>setActiveQuiz("today")} className={activeQuiz==="today"?"btn-primary":"btn-outline"} style={{padding:"7px 14px", fontSize:12, borderRadius:999}}>Today's Digest</button>
            <button onClick={()=>setActiveQuiz("all")} className={activeQuiz==="all"?"btn-primary":"btn-outline"} style={{padding:"7px 14px", fontSize:12, borderRadius:999}}>All Stories</button>
            <span style={{fontSize:12, color:"var(--text-muted)", alignSelf:"center", marginLeft:4}}>{totalQs} MCQs | GA weightage ~25% in Mains</span>
          </div>
        </div>
      </div>

      <div className="container" style={{paddingTop:16}}>
        {(activeQuiz==="today" || activeQuiz==="all") && today && (
          <div className="card" style={{padding:0, overflow:"hidden", borderLeft:"3px solid var(--accent)"}}>
            <div style={{padding:"16px 18px"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap"}}>
                <span className="badge badge-cyan">TODAY | {formatCAdate(today.date)} | {today.quiz?.length||0} Qs</span>
                <span style={{fontSize:12, color:"var(--text-muted)"}}>Source: {today.source}</span>
              </div>
              <h2 style={{fontSize:"1.1rem", marginTop:10}}>{today.title}</h2>
              <p style={{color:"var(--text-muted)", marginTop:8, fontSize:13, lineHeight:1.6}}>{today.summary}</p>
              {today.quiz && today.quiz.length>0 && (
                <div style={{marginTop:14, background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:14, padding:14}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div style={{fontWeight:800, fontSize:13, display:"flex", alignItems:"center", gap:8}}><span style={{background:"var(--accent)", color:"#0B1020", width:24, height:24, borderRadius:6, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800}}>Q</span> Today's Quiz - {today.quiz.length} questions</div>
                    <span style={{fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:999, background: todayScore.done===0 ? "var(--bg-card)" : todayScore.correct===todayScore.total ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)", color: todayScore.done===0 ? "var(--text-muted)" : todayScore.correct===todayScore.total ? "#86EFAC" : "#FCD34D", border:"1px solid var(--border)"}}>
                      {todayScore.done===0 ? "Not started" : `${todayScore.correct}/${todayScore.total} correct | ${todayScore.done}/${todayScore.total} attempted`}
                    </span>
                  </div>
                  <div style={{marginTop:12, display:"grid", gap:12}}>
                    {today.quiz.map((q, qi)=>{
                      const key=`${today.id}-${qi}`;
                      const sel=answers[key];
                      const answered = sel !== undefined;
                      return (
                        <div key={qi} style={{background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:12, padding:12}}>
                          <div style={{display:"flex", gap:8, alignItems:"flex-start"}}>
                            <span style={{background: answered ? (sel===q.answer_idx ? "rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)") : "var(--bg-elevated)", color: answered ? (sel===q.answer_idx ? "#86EFAC":"#FCA5A5") : "var(--text-muted)", minWidth:28, height:28, borderRadius:8, display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, border:"1px solid var(--border)"}}>{qi+1}</span>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:600, fontSize:13}}>{q.text}</div>
                              <div style={{marginTop:8, display:"grid", gap:6}}>
                                {q.options.map((opt, oi)=>{
                                  const isSel = sel===oi;
                                  const isRight = q.answer_idx===oi;
                                  let cls="quiz-option";
                                  if(answered){
                                    if(isSel && isRight) cls+=" correct";
                                    else if(isSel && !isRight) cls+=" wrong";
                                  } else if(isSel) cls+=" selected";
                                  return (
                                    <div key={oi} className={cls} onClick={()=>!answered && selectAns(today.id, qi, oi)} style={{margin:0}}>
                                      <span>{String.fromCharCode(65+oi)}. {opt}</span>
                                      <span style={{fontWeight:800, fontSize:11}}>{answered && isRight ? "✓" : answered && isSel ? "✗" : isSel ? "●" : ""}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              {answered && (
                                <div style={{marginTop:8, background: sel===q.answer_idx ? "rgba(34,197,94,0.08)":"rgba(245,158,11,0.08)", border:`1px solid ${sel===q.answer_idx ? "rgba(34,197,94,0.2)":"rgba(245,158,11,0.2)"}`, borderRadius:10, padding:"8px 10px", fontSize:12, color:"var(--text-muted)"}}>
                                  <strong style={{color: sel===q.answer_idx ? "#86EFAC":"#FCD34D"}}>{sel===q.answer_idx ? "✓ Correct":"✗ Incorrect"} - </strong>{q.explanation}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{marginTop:16}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <h3 style={{fontSize:"1rem"}}>Past Digests</h3>
            <span style={{fontSize:12, color:"var(--text-muted)"}}>{cas.length} stories | Tap to attempt quiz</span>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:12, marginTop:12}}>
            {cas.filter(c=> activeQuiz==="all" ? true : c.id !== today?.id).map(c=>{
              const sc = getScore(c);
              const isExp = !!expanded[c.id];
              return (
                <div key={c.id} className="card" style={{padding:0, overflow:"hidden", display:"flex", flexDirection:"column"}}>
                  <div style={{padding:"14px 16px", flex:1}}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      <span style={{fontSize:11, color:"var(--text-muted)", fontWeight:700}}>{formatCAdate(c.date)}</span>
                      <span className="badge" style={{fontSize:10}}>{c.quiz?.length||0} Qs | {sc.done>0 ? `${sc.correct}/${sc.total}` : "Not attempted"}</span>
                    </div>
                    <h3 style={{fontSize:"0.95rem", marginTop:8, lineHeight:1.35}}>{c.title}</h3>
                    <p style={{color:"var(--text-muted)", fontSize:13, marginTop:6, lineHeight:1.5, display: isExp ? "block" : "-webkit-box", overflow:"hidden", textOverflow:"ellipsis", WebkitLineClamp: isExp? "unset":2, WebkitBoxOrient:"vertical"}}>{c.summary}</p>
                    <div style={{fontSize:11, color:"var(--text-faint)", marginTop:6}}>Source: {c.source}</div>
                  </div>
                  {isExp && c.quiz && (
                    <div style={{background:"var(--bg-elevated)", borderTop:"1px solid var(--border)", padding:12, display:"grid", gap:10}}>
                      {c.quiz.map((q, qi)=>{
                        const key=`${c.id}-${qi}`;
                        const sel=answers[key];
                        const answered = sel!==undefined;
                        return (
                          <div key={qi} style={{background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:10, padding:10}}>
                            <div style={{fontWeight:600, fontSize:13}}>{qi+1}. {q.text}</div>
                            <div style={{marginTop:6, display:"grid", gap:5}}>
                              {q.options.map((opt, oi)=>{
                                const isSel=sel===oi; const isRight=q.answer_idx===oi;
                                let cls="quiz-option";
                                if(answered){
                                  if(isSel && isRight) cls+=" correct";
                                  else if(isSel && !isRight) cls+=" wrong";
                                }
                                return <div key={oi} className={cls} onClick={()=>!answered && selectAns(c.id, qi, oi)} style={{margin:"4px 0", padding:"8px 10px"}}>{String.fromCharCode(65+oi)}. {opt} {answered && isRight && "✓"}</div>;
                              })}
                            </div>
                            {answered && <div style={{marginTop:6, fontSize:11, background:"var(--bg-elevated)", border:"1px solid var(--border)", padding:"6px 8px", borderRadius:8, color:"var(--text-muted)"}}><strong>{sel===q.answer_idx?"✓ Correct":"✗ Wrong"}:</strong> {q.explanation}</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div style={{padding:"10px 16px", borderTop:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", background:"var(--bg-elevated)"}}>
                    <span style={{fontSize:12, color:"var(--text-muted)"}}>{c.quiz?.length||0} MCQs | GA</span>
                    <button className={isExp?"btn-outline":"btn-primary"} style={{padding:"6px 12px", fontSize:12}} onClick={()=> setExpanded(p=>({...p,[c.id]:!p[c.id]}))}>{isExp ? "Collapse" : sc.done>0 ? "Continue Quiz ->" : "Attempt Quiz ->"}</button>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
  );
}

// Keep StudyPlan, Review etc from original but themed via CSS vars - reuse original implementations with dark styles
function StudyPlanPage(){
  const [plan,setPlan]=useState(null);
  const [planLoading,setPlanLoading]=useState(true);
  const [planError,setPlanError]=useState("");
  const [progress,setProgress]=useState(null);
  const [syllabus,setSyllabus]=useState(null);
  const [mocks,setMocks]=useState([]);
  const [exams,setExams]=useState([]);
  const [genLoading,setGenLoading]=useState(false);
  const [genError,setGenError]=useState("");
  const [genSuccess,setGenSuccess]=useState("");
  const [todayDone,setTodayDone]=useState(()=>{ try{ return JSON.parse(localStorage.getItem("bp_today_done")||"[]"); }catch{ return []; }});
  const [form,setForm]=useState({
    target_exam:"IBPS PO",
    exam_date: new Date(Date.now()+60*86400000).toISOString().slice(0,10),
    daily_hours:"3",
    level:"Intermediate",
    preferred_time:"Morning (6-10 AM)",
    weak_subjects:[]
  });
  const loadAll = async()=>{
    setPlanLoading(true); setPlanError("");
    try{
      const [p, prog, syl, mk, ex] = await Promise.all([
        getPlan().catch(()=>null),
        getProgress().catch(()=>null),
        getSyllabus().catch(()=>null),
        getMocks().catch(()=>[]),
        getExams().catch(()=>[])
      ]);
      if(p && !p.message) setPlan(p); else if(p?.message) setPlan(null);
      else setPlan(p);
      setProgress(prog); setSyllabus(syl); setMocks(Array.isArray(mk)?mk:[]); setExams(Array.isArray(ex)?ex:[]);
      if(p && !p.message) setForm(f=>({...f, target_exam: p.target_exam || f.target_exam, exam_date: p.exam_date || f.exam_date, daily_hours: String(p.phases?.[0]?.hours_per_day || f.daily_hours)}));
    }catch(e){ setPlanError(e.response?.data?.detail || e.message); }
    finally{ setPlanLoading(false); }
  };
  useEffect(()=>{ loadAll(); },[]);
  const formatDate = (iso)=>{ if(!iso) return "-"; try{ return new Date(iso).toLocaleDateString("en-GB",{day:"numeric", month:"short", year:"numeric"}); }catch{ return iso; } };
  const daysRemaining = (iso)=>{ if(!iso) return 0; const target=new Date(iso); const today=new Date(); today.setHours(0,0,0,0); target.setHours(0,0,0,0); return Math.max(0, Math.ceil((target - today)/86400000)); };
  const overallProgress = progress?.syllabus_covered ?? 0;
  const weakFromBackend = progress?.weak_topics || [];
  const syllabusOverall = syllabus ? Math.round(syllabus.reduce((a,s)=>a + s.overall,0)/syllabus.length) : overallProgress;
  const handleGenerate = async()=>{
    setGenError(""); setGenSuccess("");
    if(!form.target_exam.trim()){ setGenError("Please select a target exam."); return; }
    if(!form.exam_date){ setGenError("Please choose your exam date."); return; }
    if(new Date(form.exam_date) <= new Date()){ setGenError("Exam date must be in the future."); return; }
    const hrs = parseInt(form.daily_hours,10);
    if(isNaN(hrs) || hrs<1 || hrs>12){ setGenError("Daily study hours should be 1-12."); return; }
    setGenLoading(true);
    try{
      const payload = { target_exam: form.target_exam, exam_date: form.exam_date, daily_hours: hrs, weak_topics: form.weak_subjects.length? form.weak_subjects : (weakFromBackend.length? weakFromBackend.slice(0,3): undefined) };
      const p = await generatePlan(payload);
      setPlan(p); setGenSuccess(`Study plan generated for ${p.target_exam} | ${p.days_left} days | ${p.phases.length} phases`);
      setTimeout(()=>setGenSuccess(""),4000);
    }catch(e){
      const detail = e.response?.data?.detail;
      if(detail && Array.isArray(detail)) setGenError(detail.map(d=>d.msg).join(", "));
      else setGenError(detail || e.message || "Failed to generate plan");
    }finally{ setGenLoading(false); }
  };
  const todayStr = new Date().toLocaleDateString("en-US",{weekday:"long", day:"numeric", month:"long"});
  const todayTasksDefs = plan?.daily_tasks?.[0] ? [
    {id:1, title: plan.phases?.[0]?.focus?.split("+")[0]?.trim() || "Simplification", meta:"Quantitative Aptitude | 30 min | 20 questions", icon:"📐", time:"30m"},
    {id:2, title:"Seating Arrangement", meta:"Reasoning | 45 min | 15 questions", icon:"🧩", time:"45m"},
    {id:3, title:"Reading Comprehension", meta:"English | 45 min | 2 passages", icon:"📖", time:"45m"},
    {id:4, title:"Daily Current Affairs", meta:"General Awareness | 30 min | Quiz", icon:"📰", time:"30m"},
    {id:5, title:"Revision & Review", meta:"Mixed | 30 min | Weak topics", icon:"🔁", time:"30m"},
  ] : [
    {id:1, title:"Simplification - 30 min", meta:"Quant | 20 questions", icon:"📐", time:"30m"},
    {id:2, title:"Seating Arrangement - 45 min", meta:"Reasoning | 15 questions", icon:"🧩", time:"45m"},
    {id:3, title:"Reading Comprehension - 45 min", meta:"English | 2 passages", icon:"📖", time:"45m"},
  ];
  const toggleToday = (id)=>{
    const next = todayDone.includes(id)? todayDone.filter(x=>x!==id) : [...todayDone, id];
    setTodayDone(next); localStorage.setItem("bp_today_done", JSON.stringify(next));
  };
  const todayProgress = todayTasksDefs.length ? Math.round(todayDone.length / todayTasksDefs.length * 100) : 0;
  const phaseProgress = (phaseName, idx)=>{
    if(!syllabus || !progress) return idx===0? Math.min(92, overallProgress+12) : idx===1? Math.min(60, overallProgress-15) : Math.min(20, Math.max(0, overallProgress-40));
    if(phaseName.toLowerCase().includes("found")) return syllabusOverall;
    if(phaseName.toLowerCase().includes("inter")) return Math.max(15, Math.min(65, syllabusOverall - 20));
    return Math.max(5, Math.min(35, overallProgress - 30));
  };
  if(planLoading){
    return <div className="container" style={{padding:"32px 24px"}}><div className="skeleton" style={{height:140, borderRadius:16, marginBottom:16}}></div><div className="skeleton" style={{height:260, borderRadius:16}}></div></div>;
  }
  if(planError){
    return <div className="container" style={{padding:"32px 24px"}}><div className="card" style={{textAlign:"center", padding:32}}><h3 style={{color:"var(--danger)"}}>Unable to load study plan</h3><p style={{color:"var(--text-muted)", marginTop:6}}>{planError}</p><button className="btn-primary" style={{marginTop:12}} onClick={loadAll}>Retry</button></div></div>;
  }
  if(!plan){
    return (
      <div>
        <div style={{background:"var(--bg-card)", borderBottom:"1px solid var(--border)", padding:"22px 0 18px"}}>
          <div className="container" style={{paddingTop:0, paddingBottom:0}}><div style={{maxWidth:760}}><span className="badge">AI STUDY PLANNER | NEW</span><h1 style={{fontSize:"2rem", marginTop:10}}>Your AI Study Plan</h1><p style={{color:"var(--text-muted)", marginTop:8, fontSize:14, lineHeight:1.6}}>Prepare smarter. Stay consistent. Reach your target score. Generate a personalised plan tied to your exam date, daily availability and weak areas.</p></div></div>
        </div>
        <div className="container" style={{marginTop:16}}>
          <div className="card" style={{textAlign:"center", padding:32, borderStyle:"dashed"}}>
            <div style={{fontSize:40}}>🗺️</div>
            <h3 style={{marginTop:10}}>Your study plan hasn't been generated yet.</h3>
            <p style={{color:"var(--text-muted)", marginTop:6, maxWidth:480, marginInline:"auto", fontSize:13}}>Tell us your target exam, exam date and how much time you can study each day. We'll build a phased journey with daily tasks.</p>
            <button className="btn-primary" style={{marginTop:14}} onClick={()=>document.getElementById("plan-generator")?.scrollIntoView({behavior:"smooth"})}>Generate Study Plan ↓</button>
          </div>
          <div id="plan-generator" style={{marginTop:18}}>
            <GeneratorCard form={form} setForm={setForm} onGenerate={handleGenerate} loading={genLoading} error={genError} success={genSuccess} exams={exams} syllabus={syllabus} weakFromBackend={weakFromBackend} />
          </div>
        </div>
      </div>
    );
  }
  const daysLeft = daysRemaining(plan.exam_date);
  const hrsWeek = (parseInt(plan.phases?.[0]?.hours_per_day || form.daily_hours,10) * 7);
  return (
    <div>
      <div style={{background:"var(--bg-card)", borderBottom:"1px solid var(--border)", padding:"20px 0 16px"}}>
        <div className="container" style={{paddingTop:0, paddingBottom:0}}>
          <div style={{display:"grid", gridTemplateColumns:"1.15fr 0.85fr", gap:18}}>
            <div>
              <span className="badge">PERSONALISED | AI GENERATED</span>
              <h1 style={{fontSize:"1.7rem", marginTop:10}}>Your AI Study Plan</h1>
              <p style={{color:"var(--text-muted)", marginTop:6, fontSize:13}}>Prepare smarter. Stay consistent. Reach your target score.</p>
              <div style={{display:"flex", gap:16, marginTop:14, flexWrap:"wrap"}}>
                <div><div style={{fontSize:10, color:"var(--text-faint)", fontWeight:800, letterSpacing:"0.06em"}}>TARGET EXAM</div><div style={{fontWeight:800, marginTop:2}}>{plan.target_exam}</div></div>
                <div style={{width:1, background:"var(--border)"}}></div>
                <div><div style={{fontSize:10, color:"var(--text-faint)", fontWeight:800, letterSpacing:"0.06em"}}>EXAM DATE</div><div style={{fontWeight:800, marginTop:2}}>{formatDate(plan.exam_date)}</div></div>
                <div style={{width:1, background:"var(--border)"}}></div>
                <div><div style={{fontSize:10, color:"var(--text-faint)", fontWeight:800, letterSpacing:"0.06em"}}>DAILY TARGET</div><div style={{fontWeight:800, marginTop:2}}>{plan.phases?.[0]?.hours_per_day || form.daily_hours}h / day</div></div>
              </div>
            </div>
            <div className="card">
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div><div style={{fontSize:10, fontWeight:800, letterSpacing:"0.06em", color:"var(--accent)"}}>YOUR PREPARATION</div><div style={{fontWeight:800, marginTop:4}}>{plan.target_exam}</div></div>
                <div style={{background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:999, padding:"6px 10px", fontWeight:800, fontSize:12, color: daysLeft < 14 ? "var(--danger)" : "var(--accent)"}}>{daysLeft} days left</div>
              </div>
              <div style={{marginTop:12}}>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--text-muted)"}}><span>{overallProgress}% preparation complete</span><span style={{fontWeight:700, color:"var(--accent)"}}>{overallProgress}%</span></div>
                <div className="progress-track" style={{marginTop:6}}><div className="progress-fill" style={{width:`${overallProgress}%`}}></div></div>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:12}}>
                <div style={{background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:10, padding:10}}><div style={{fontSize:10, color:"var(--text-faint)", fontWeight:700}}>THIS WEEK</div><div style={{fontWeight:700, marginTop:2, fontSize:13}}>{hrsWeek}h planned</div><div style={{fontSize:11, color:"var(--text-muted)"}}>{plan.days_left} days total</div></div>
                <div style={{background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:10, padding:10}}><div style={{fontSize:10, color:"var(--text-faint)", fontWeight:700}}>PROGRESS</div><div style={{fontWeight:700, marginTop:2, fontSize:13}}>{progress?.questions_solved ?? 0} Qs | {progress?.accuracy ?? 0}%</div><div style={{fontSize:11, color:"var(--text-muted)"}}>{progress?.streak ?? 0} day streak</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{marginTop:16}}>
        <div style={{display:"grid", gridTemplateColumns:"1.6fr 0.8fr", gap:16}}>
          <div style={{display:"flex", flexDirection:"column", gap:14}}>
            <div className="card" style={{padding:0, overflow:"hidden"}}>
              <div style={{padding:"14px 16px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div><div style={{fontSize:10, fontWeight:800, letterSpacing:"0.08em", color:"var(--accent)"}}>TODAY'S PLAN</div><div style={{fontWeight:700, marginTop:2, fontSize:13}}>{todayStr} | {plan.phases?.[0]?.hours_per_day || form.daily_hours} hours planned</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:11, color:"var(--text-muted)"}}>{todayDone.length}/{todayTasksDefs.length} done</div><div className="progress-track" style={{width:96, marginTop:4}}><div className="progress-fill" style={{width:`${todayProgress}%`, background:"#22C55E"}}></div></div></div>
              </div>
              <div style={{padding:"8px 12px"}}>
                {todayTasksDefs.map(t=>{
                  const done = todayDone.includes(t.id);
                  const isNext = !done && todayDone.length === todayTasksDefs.findIndex(x=>x.id===t.id);
                  return (
                    <div key={t.id} onClick={()=>toggleToday(t.id)} style={{display:"flex", alignItems:"center", gap:12, padding:"11px 10px", borderRadius:10, cursor:"pointer", background: done? "rgba(34,197,94,0.08)" : isNext ? "rgba(79,70,229,0.08)" : "transparent", border: isNext ? "1px solid rgba(79,70,229,0.2)" : "1px solid transparent", marginTop:6}}>
                      <div style={{width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background: done? "#22C55E" : isNext? "var(--primary)" : "var(--bg-elevated)", color: done||isNext? "#fff" : "var(--text-faint)", fontSize:13, border:"1px solid var(--border)"}}>{done ? "✓" : isNext ? "->" : "○"}</div>
                      <div style={{width:28, height:28, borderRadius:8, background:"var(--bg-elevated)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14}}>{t.icon}</div>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontWeight:600, fontSize:13, textDecoration: done? "line-through":"none", color: done? "var(--text-muted)":"var(--text)"}}>{t.title}</div>
                        <div style={{fontSize:11, color:"var(--text-muted)"}}>{t.meta}</div>
                      </div>
                      <div style={{fontSize:11, fontWeight:700, color:"var(--text-muted)", background:"var(--bg-elevated)", border:"1px solid var(--border)", padding:"4px 8px", borderRadius:999}}>{t.time}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{padding:"12px 16px", borderTop:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span style={{fontSize:12, color:"var(--text-muted)"}}>{todayDone.length===todayTasksDefs.length ? "Great work - today's plan completed!" : `${todayTasksDefs.length - todayDone.length} tasks remaining`}</span>
                <button className="btn-primary" style={{padding:"8px 14px", fontSize:12}} onClick={()=>{ if(todayDone.length===todayTasksDefs.length) { setTodayDone([]); localStorage.setItem("bp_today_done","[]"); } else { const all = todayTasksDefs.map(x=>x.id); setTodayDone(all); localStorage.setItem("bp_today_done", JSON.stringify(all)); } }}>{todayDone.length===todayTasksDefs.length ? "Reset" : "Start Today's Plan ->"}</button>
              </div>
            </div>
            <div className="card">
              <h3 style={{fontSize:"0.95rem"}}>Preparation Journey | {plan.days_left} days | {plan.phases.length} phases</h3>
              <div style={{marginTop:12, display:"grid", gap:10}}>
                {plan.phases.map((ph, i)=>{
                  const prog = phaseProgress(ph.phase, i);
                  const isCurrent = i===1 || (i===0 && prog < 100);
                  const isCompleted = prog >= 100 || (i===0 && overallProgress>75);
                  return (
                    <div key={i} style={{display:"flex", gap:12, padding:12, background: isCurrent ? "rgba(79,70,229,0.06)" : "var(--bg-elevated)", border:`1px solid ${isCurrent ? "rgba(79,70,229,0.2)" : "var(--border)"}`, borderRadius:12}}>
                      <div style={{width:30,height:30, borderRadius:"50%", display:"flex",alignItems:"center",justifyContent:"center", background: isCompleted?"#22C55E": isCurrent?"var(--primary)":"var(--bg-card)", color:"#fff", fontWeight:800, fontSize:12, border:"1px solid var(--border)", flexShrink:0}}>{isCompleted?"✓": i+1}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800, fontSize:13}}>{ph.phase}</div>
                        <div style={{fontSize:11, color:"var(--text-muted)", marginTop:2}}>{ph.focus}</div>
                        <div className="progress-track" style={{marginTop:8}}><div className="progress-fill" style={{width:`${prog}%`, background: isCompleted? "#22C55E":"linear-gradient(90deg,#4F46E5,#38BDF8)"}}></div></div>
                        <div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>{ph.days} days | {ph.hours_per_day}h/day | {prog}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{display:"flex", flexDirection:"column", gap:14}}>
            <GeneratorCard form={form} setForm={setForm} onGenerate={handleGenerate} loading={genLoading} error={genError} success={genSuccess} exams={exams} syllabus={syllabus} weakFromBackend={weakFromBackend} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneratorCard({form,setForm,onGenerate,loading,error,success,exams,syllabus,weakFromBackend}){
  return (
    <div className="card" id="plan-generator" style={{padding:16}}>
      <div style={{display:"flex", alignItems:"center", gap:8}}><span style={{background:"var(--primary)", color:"#fff", width:28, height:28, borderRadius:8, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:14}}>⚙️</span><div><div style={{fontWeight:800, fontSize:13}}>Configure Your Plan</div><div style={{fontSize:11, color:"var(--text-muted)"}}>Adjust and regenerate anytime</div></div></div>
      <div style={{marginTop:12, display:"grid", gap:12}}>
        <div>
          <label className="field-label">Target Exam *</label>
          <select value={form.target_exam} onChange={e=>setForm({...form,target_exam:e.target.value})} className="field-input">
            {(exams.length? exams.map(e=>e.name) : ["IBPS PO","SBI Clerk","RBI Grade B","IBPS Clerk"]).map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Exam Date *</label>
          <input type="date" value={form.exam_date} onChange={e=>setForm({...form,exam_date:e.target.value})} className="field-input" min={new Date().toISOString().slice(0,10)} />
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
          <div>
            <label className="field-label">Daily Hours *</label>
            <select value={form.daily_hours} onChange={e=>setForm({...form,daily_hours:e.target.value})} className="field-input">
              {[1,2,3,4,5,6].map(h=><option key={h} value={String(h)}>{h}h / day</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Level</label>
            <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})} className="field-input">
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
        </div>
        <div>
          <label className="field-label">Weak Subjects (optional)</label>
          <div style={{display:"flex", gap:6, flexWrap:"wrap", marginTop:6}}>
            {(syllabus? syllabus.map(s=>s.subject) : ["Quantitative Aptitude","Reasoning","English","General Awareness"]).map(sub=>{
              const sel=form.weak_subjects.includes(sub);
              return <button key={sub} type="button" onClick={()=> setForm({...form, weak_subjects: sel? form.weak_subjects.filter(x=>x!==sub) : [...form.weak_subjects, sub]})} style={{padding:"5px 10px", borderRadius:999, border: sel? "1px solid var(--primary)":"1px solid var(--border)", background: sel? "rgba(79,70,229,0.15)":"transparent", color: sel? "var(--text)":"var(--text-muted)", fontSize:11, fontWeight:600}}>{sel?"✓ ":""}{sub}</button>;
            })}
          </div>
          {weakFromBackend.length>0 && <div style={{fontSize:11, color:"var(--text-muted)", marginTop:6}}>Detected weak: {weakFromBackend.join(" | ")}</div>}
        </div>
        {error && <div style={{background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#FCA5A5", padding:"10px 12px", borderRadius:10, fontSize:12}}>⚠️ {error}</div>}
        {success && <div style={{background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", color:"#86EFAC", padding:"10px 12px", borderRadius:10, fontSize:12}}>✓ {success}</div>}
        <button className="btn-primary" style={{width:"100%", padding:"12px", opacity: loading?0.7:1}} onClick={onGenerate} disabled={loading}>
          {loading ? <><span className="spinner"></span> Generating...</> : <>Generate My Study Plan -></>}
        </button>
      </div>
    </div>
  );
}

function ReviewPage(){
  const [due,setDue]=useState([]); const [bms,setBms]=useState([]);
  const refresh=()=>{ getDue().then(setDue).catch(()=>setDue([])); getBookmarks().then(setBms).catch(()=>{}); };
  useEffect(()=>{refresh();},[]);
  const addSample=async()=>{ try{ await addReview(1); refresh(); }catch(e){ alert(e.response?.data?.detail||e.message+" - login required"); } };
  return <div className="container"><h2>Review Queue (SM-2) + Bookmarks <span className="badge badge-success">Login required</span></h2>
    <div style={{display:"flex", gap:8, marginTop:12}}><button className="btn-primary" onClick={addSample}>Add Q1 to Review</button><button className="btn-outline" onClick={refresh}>Refresh Due</button></div>
    <div className="card-grid" style={{marginTop:16}}><div className="card"><h3>Due Now ({due.length})</h3>{due.length===0?<p style={{color:"var(--text-muted)", fontSize:13, marginTop:6}}>No due cards. Fail a question to schedule review.</p>: due.map(d=><div key={d.review_id} style={{border:"1px solid var(--border)", borderRadius:12, padding:12, marginTop:8, background:"var(--bg-elevated)"}}><strong style={{fontSize:13}}>{d.question?.text}</strong><div style={{display:"flex", gap:6, marginTop:8}}>{[0,2,5].map(q=><button key={q} className={q===5?"btn-primary":"btn-outline"} style={{padding:"6px 10px", fontSize:12}} onClick={async()=>{await gradeReview(d.review_id,q); refresh();}}>{q===0?"Again":q===2?"Hard":"Easy"}</button>)}</div><small style={{color:"var(--text-muted)"}}>Interval {d.interval}d | Ease {d.ease?.toFixed(2)}</small></div>)}</div>
    <div className="card"><h3>Bookmarks ({bms.length})</h3>{bms.length===0?<p style={{color:"var(--text-muted)", fontSize:13, marginTop:6}}>No bookmarks. Click ★ in Practice to save (needs login).</p>: bms.map(b=><div key={b.id} style={{border:"1px solid var(--border)", borderRadius:10, padding:10, marginTop:8, background:"var(--bg-elevated)"}}>{b.question?.text}<div style={{color:"var(--text-muted)", fontSize:11, marginTop:4}}>Note: {b.note||"-"}</div></div>)}</div></div></div>;
}

function Login({ setPage, onLogin }) {
  const [email, setEmail] = useState("demo@bankprepare.ai");
  const [pwd, setPwd] = useState("demo123");
  const [msg, setMsg] = useState("");
  const submit = async ()=>{
    setMsg(`Connecting to POST ${API_URL}/auth/login …`);
    try{
      const r = await loginApi({email, password:pwd});
      const token = r.access_token || r.token;
      if(!token) throw new Error("No token in response");
      localStorage.setItem("bp_token", token);
      localStorage.setItem("bp_user", JSON.stringify(r.user));
      setMsg("✅ " + r.message + " - token saved. Redirecting…");
      if(onLogin) onLogin();
      setTimeout(()=>setPage("dashboard"), 800);
    } catch(e){
      const status = e.response?.status;
      const data = e.response?.data;
      let reason = data?.detail || e.message;
      if(status === 500 && !data?.detail){
        reason = typeof data === "string" && !data.trim().startsWith("<")
          ? `Server error: ${data.slice(0, 160)}`
          : `Server error (HTTP 500, no JSON detail — backend crashed or VITE_API_URL points nowhere. API=${API_URL})`;
      }
      if(!e.response && e.message?.toLowerCase().includes("timeout")){
        reason = `Backend did not respond in 30s (cold start?). API=${API_URL} — retry once.`;
      }
      setMsg("❌ " + reason);
    }
  };
  return <div className="container" style={{maxWidth:440}}><div className="card" style={{marginTop:24}}><h3 style={{textAlign:"center"}}>Welcome back</h3><p style={{textAlign:"center", color:"var(--text-muted)", fontSize:12, marginTop:4}}>Login to access your premium preparation workspace</p>
    <div style={{marginTop:16}}>
      <label className="field-label">Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="field-input" style={{margin:"6px 0 12px"}}/>
      <label className="field-label">Password</label>
      <input value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Password" type="password" className="field-input" style={{margin:"6px 0"}}/>
    </div>
    <button className="btn-primary" style={{width:"100%", marginTop:14}} onClick={submit}>Login -> Dashboard</button>
    {msg && <p style={{fontSize:12, marginTop:10, background:"var(--bg-elevated)", padding:10, borderRadius:10, border:"1px solid var(--border)", color:"var(--text-muted)"}}>{msg}</p>}
    <p style={{fontSize:11, color:"var(--text-faint)", marginTop:12, textAlign:"center"}}>Demo: demo@bankprepare.ai / demo123 | Premium dark theme</p>
  </div></div>;
}

function ThemeToggleInline(){
  const { theme, toggle } = useTheme();
  return <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme" title={`Switch to ${theme==="dark"?"light":"dark"}`}>{theme==="dark" ? "☀️" : "🌙"}</button>;
}

export default function App() {
  const getIsLogged = ()=> !!localStorage.getItem("bp_token");
  const [isLogged, setIsLogged] = useState(getIsLogged);
  const [page, setPage] = useState(()=> getIsLogged() ? "dashboard" : "landing");
  const protectedPages = ["dashboard","practice","mocks","ca","ca2","plan","review","tutor","games","syllabus","mistakes","adaptive","tournament","progress","leaderboard"];
  const auth = useAuth();
  const authLogout = auth?.logout;

  const handleSetPage = (next)=>{
    if(protectedPages.includes(next) && !getIsLogged()){
      setPage("login");
      return;
    }
    setPage(next);
  };

  const handleLogin = ()=> setIsLogged(true);
  const handleLogout = ()=>{
    try{ authLogout && authLogout(); }catch{}
    localStorage.removeItem("bp_token");
    localStorage.removeItem("bp_user");
    localStorage.removeItem("bp_today_done");
    setIsLogged(false);
    setPage("landing");
  };

  useEffect(()=>{
    const onStorage=()=> setIsLogged(getIsLogged());
    window.addEventListener("storage", onStorage);
    return ()=> window.removeEventListener("storage", onStorage);
  },[]);

  useEffect(()=>{
    if(!isLogged && protectedPages.includes(page)) setPage("login");
  },[isLogged]);

  const renderPage = ()=>{
    if(!isLogged){
      if(page==="landing") return <Landing setPage={handleSetPage} />;
      return <Login setPage={handleSetPage} onLogin={handleLogin} />;
    }
    switch(page){
      case "landing": return <Landing setPage={handleSetPage} />;
      case "dashboard": return <Dashboard setPage={handleSetPage} />;
      case "practice": return <Practice />;
      case "mocks": return <MocksPage />;
      case "ca": return <CurrentAffairsPage />;
      case "ca2": return <CurrentAffairsLearning />;
      case "plan": return <StudyPlanPage />;
      case "review": return <ReviewPage />;
      case "syllabus": return <Syllabus setPage={handleSetPage} />;
      case "tutor": return <Tutor />;
      case "games": return <div className="container"><div className="card" style={{padding:24, textAlign:"center"}}><h3>Games</h3><p style={{color:"var(--text-muted)", fontSize:13, marginTop:6}}>Play & learn - coming from existing Games page.</p><button className="btn-primary" style={{marginTop:12}} onClick={()=>handleSetPage("dashboard")}>Back to Dashboard</button></div></div>;
      case "mistakes": return <MistakeNotebook />;
      case "adaptive": return <AdaptiveQuiz />;
      case "tournament": return <WeeklyTournament />;
      case "progress": return <ProgressAnalytics />;
      case "leaderboard": return <LeaderboardPage />;
      default: return <Dashboard setPage={handleSetPage} />;
    }
  };

  return (
    <AppShell page={page} setPage={handleSetPage} isLogged={isLogged} onLogout={handleLogout}>
      {!isLogged && page!=="landing" && page!=="login" ? <Login setPage={handleSetPage} onLogin={handleLogin} /> : null}
      {/* For logged-out landing we bypass AppShell header - render directly */}
      {!isLogged ? (
        <div style={{minHeight:"100vh", display:"flex", flexDirection:"column"}}>
          <div style={{padding:"14px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid var(--border)", background:"var(--bg-card)", position:"sticky", top:0, zIndex:20}}>
            <div style={{display:"flex", gap:10, alignItems:"center"}}><div style={{width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#4F46E5,#38BDF8)", display:"flex", alignItems:"center", justifyContent:"center", padding:4}}><svg viewBox="0 0 32 32" width="26" height="26"><path d="M16 5.5 L24.5 10.2 L24.5 16.8 C24.5 20.8 21.2 24.2 16 27 L10.8 24.2 C7.2 21.8 7.5 16.8 7.5 16.8 L7.5 10.2 Z" fill="white" stroke="rgba(255,255,255,0.9)" strokeWidth="0.6"/><path d="M16 8.5 L9.5 12 L10.5 12 L16 9.2 L21.5 12 L22.5 12 Z" fill="#4F46E5"/><rect x="9.8" y="13.2" width="1.9" height="6.2" rx="0.4" fill="#4F46E5"/><rect x="12.7" y="13.2" width="1.9" height="6.2" rx="0.4" fill="#4F46E5"/><rect x="15.05" y="13.2" width="1.9" height="6.2" rx="0.4" fill="#4338CA"/><rect x="17.4" y="13.2" width="1.9" height="6.2" rx="0.4" fill="#4F46E5"/><rect x="20.3" y="13.2" width="1.9" height="6.2" rx="0.4" fill="#4F46E5"/><rect x="9.5" y="20" width="13" height="1.6" rx="0.5" fill="#4F46E5"/></svg></div><span style={{fontWeight:800}}>BankPrepare AI</span> <span style={{fontSize:10, background:"var(--bg-elevated)", border:"1px solid var(--border)", padding:"3px 7px", borderRadius:999, color:"var(--accent)"}}>IBPS | SBI | RBI</span></div>
            <div style={{display:"flex", gap:8, alignItems:"center"}}><ThemeToggleInline /><button className="btn-outline" onClick={()=>setPage("login")}>Login</button><button className="btn-primary" onClick={()=>setPage("login")}>Start Preparing</button></div>
          </div>
          {renderPage()}
          <div style={{textAlign:"center", padding:20, color:"var(--text-faint)", fontSize:11, borderTop:"1px solid var(--border)", marginTop:24}}>© 2026 BankPrepare AI - Premium AI Education | BankPrepare AI</div>
        </div>
      ) : (
        <>
          {renderPage()}
          <div style={{textAlign:"center", padding:18, color:"var(--text-faint)", fontSize:11, borderTop:"1px solid var(--border)", marginTop:16}}>© 2026 BankPrepare AI - Trusted by banking aspirants | Premium Dark</div>
        </>
      )}
    </AppShell>
  );
}

