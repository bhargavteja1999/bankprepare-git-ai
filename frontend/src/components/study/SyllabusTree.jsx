import { useState } from "react";

export default function SyllabusTree({ data=[], setPage }){
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const toggleSubject = (idx)=> setExpandedSubjects(s=>({...s,[idx]:!s[idx]}));
  const toggleTopic = (sIdx, tIdx)=> {
    const key=`${sIdx}-${tIdx}`;
    setExpandedTopics(s=>({...s,[key]:!s[key]}));
  };
  if(!data || data.length===0) return <div className="card" style={{textAlign:"center", padding:32}}><div className="skeleton" style={{height:80, borderRadius:12}}></div><p style={{color:"var(--text-muted)", marginTop:10, fontSize:13}}>Loading syllabus...</p></div>;
  return (
    <div style={{display:"grid", gap:14}}>
      {data.map((subj, sIdx)=>{
        const isOpen = !!expandedSubjects[sIdx];
        const overall = subj.overall ?? subj.progress ?? 0;
        return (
          <div key={subj.subject} className="card" style={{padding:0, overflow:"hidden", borderLeft: isOpen? "3px solid var(--primary)":"1px solid var(--border)"}}>
            {/* Subject header */}
            <div onClick={()=>toggleSubject(sIdx)} style={{padding:"14px 16px", display:"flex", gap:12, alignItems:"center", cursor:"pointer", background: isOpen? "var(--bg-elevated)":"transparent"}}>
              <div style={{width:42,height:42, borderRadius:12, background: "linear-gradient(135deg,var(--primary),var(--accent))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0}}>{subj.icon || "📚"}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight:800, fontSize:14, display:"flex", gap:8, alignItems:"center", flexWrap:"wrap"}}>
                  {subj.subject}
                  <span style={{fontSize:11, background:"var(--bg-card)", border:"1px solid var(--border)", padding:"2px 7px", borderRadius:999, color:"var(--text-muted)"}}>{subj.topic_count} Topics | {subj.subtopic_count} Subtopics</span>
                </div>
                {subj.description && <div style={{fontSize:11, color:"var(--text-muted)", marginTop:2}}>{subj.description}</div>}
                <div style={{marginTop:8, display:"flex", gap:8, alignItems:"center"}}>
                  <div className="progress-track" style={{flex:1, maxWidth:180}}><div className="progress-fill" style={{width:`${overall}%`, background: overall>=70?"#22C55E": overall>=40?"#4F46E5":"#F59E0B"}}></div></div>
                  <span style={{fontSize:11, fontWeight:700, color: overall>=70?"#22C55E": overall>=40?"var(--primary)":"var(--warning)"}}>{overall}%</span>
                </div>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end"}}>
                <button className={isOpen?"btn-primary":"btn-outline"} style={{padding:"6px 12px", fontSize:12, pointerEvents:"none"}}>{isOpen? "Collapse":"Expand Syllabus"}</button>
                <span style={{fontSize:16, color:"var(--text-muted)", transform: isOpen? "rotate(180deg)":"rotate(0)", transition:"transform .2s"}}>▼</span>
              </div>
            </div>
            {/* Topics */}
            {isOpen && (
              <div style={{borderTop:"1px solid var(--border)", background:"var(--bg)", padding:12, display:"grid", gap:8}}>
                {subj.topics.map((topic, tIdx)=>{
                  const tKey=`${sIdx}-${tIdx}`;
                  const isTopicOpen = !!expandedTopics[tKey];
                  const prog = topic.progress ?? 0;
                  const hasProgress = prog>0;
                  return (
                    <div key={topic.name} style={{background:"var(--bg-card)", border:`1px solid ${isTopicOpen?"var(--primary)":"var(--border)"}`, borderRadius:12, overflow:"hidden"}}>
                      <div onClick={()=>toggleTopic(sIdx,tIdx)} style={{padding:"10px 12px", display:"flex", gap:10, alignItems:"center", cursor:"pointer", background: isTopicOpen? "rgba(79,70,229,0.06)":"transparent"}}>
                        <span style={{width:22, height:22, borderRadius:6, background: isTopicOpen? "var(--primary)":"var(--bg-elevated)", color: isTopicOpen? "#fff":"var(--text-muted)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0}}>{isTopicOpen?"-":"+"}</span>
                        <div style={{flex:1, minWidth:0}}>
                          <div style={{fontWeight:700, fontSize:13, display:"flex", gap:6, alignItems:"center"}}>
                            {topic.name}
                            <span style={{fontSize:10, padding:"2px 6px", borderRadius:999, background: hasProgress? (prog>=70?"rgba(34,197,94,0.12)":"rgba(79,70,229,0.12)"):"var(--bg-elevated)", color: hasProgress? (prog>=70?"#22C55E":"#6366F1"):"var(--text-faint)", border:"1px solid var(--border)"}}>{hasProgress? `${prog}%`:"Not started"}</span>
                          </div>
                          <div style={{fontSize:11, color:"var(--text-muted)", marginTop:1}}>{topic.subtopic_count} subtopics</div>
                        </div>
                        <div style={{display:"flex", gap:4, alignItems:"center"}}>
                          <div className="progress-track" style={{width:70}}><div className="progress-fill" style={{width:`${prog}%`, background: prog>=70?"#22C55E": prog>=40?"#4F46E5":"#E2E8F0"}}></div></div>
                          <span style={{fontSize:18, color:"var(--text-faint)", transform: isTopicOpen?"rotate(90deg)":"rotate(0)", transition:"transform .2s"}}>▶</span>
                        </div>
                      </div>
                      {isTopicOpen && (
                        <div style={{borderTop:"1px solid var(--border)", padding:12, background:"var(--bg-elevated)"}}>
                          {/* Subtopics */}
                          <div style={{display:"grid", gap:6}}>
                            {topic.subtopics.map(st=>(
                              <div key={st} style={{display:"flex", gap:8, alignItems:"center", fontSize:12, padding:"6px 8px", background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:8}}>
                                <span style={{width:6, height:6, borderRadius:"50%", background:"var(--primary)", flexShrink:0}}></span>
                                <span style={{color:"var(--text)", flex:1}}>{st}</span>
                                <span style={{fontSize:10, color:"var(--text-faint)"}}>○</span>
                              </div>
                            ))}
                          </div>
                          {/* Progress & Actions */}
                          <div style={{marginTop:10, padding:10, background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:10}}>
                            <div style={{display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text-muted)"}}><span>Progress</span><span style={{fontWeight:700, color: hasProgress? "var(--primary)":"var(--text-faint)"}}>{hasProgress? `${prog}%`:"Not started"}</span></div>
                            <div className="progress-track" style={{marginTop:6}}><div className="progress-fill" style={{width:`${prog}%`}}></div></div>
                            {hasProgress ? (
                              <div style={{display:"flex", gap:6, fontSize:11, color:"var(--text-muted)", marginTop:6}}><span>Accuracy: {prog>=70?"High":prog>=50?"Medium":"Low"}</span><span>|</span><span>Keep practicing</span></div>
                            ) : (
                              <div style={{fontSize:11, color:"var(--text-faint)", marginTop:6}}>Start practicing to track progress</div>
                            )}
                            <div style={{display:"flex", gap:6, flexWrap:"wrap", marginTop:10}}>
                              <button className="btn-primary" style={{padding:"6px 10px", fontSize:11}} onClick={()=>{ if(setPage) setPage("practice"); else window.location.hash="practice"; }}>Practice</button>
                              <button className="btn-outline" style={{padding:"6px 10px", fontSize:11}} onClick={()=>{ if(setPage) setPage("tutor"); else alert("AI Tutor for "+topic.name); }}>AI Tutor</button>
                              <button className="btn-ghost" style={{padding:"6px 10px", fontSize:11}} onClick={()=>{ if(setPage) setPage("practice"); }}>Questions</button>
                              <button className="btn-ghost" style={{padding:"6px 10px", fontSize:11}} onClick={()=>{ if(setPage) setPage("tutor"); }}>Learn</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
