import { useEffect, useState } from "react";
import { getSyllabus } from "../services/examApi";
import SyllabusTree from "../components/study/SyllabusTree";
export default function Syllabus({ setPage }){
  const [data,setData]=useState([]);
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
      <div style={{fontSize:11, color:"var(--text-muted)", background:"var(--bg-card)", border:"1px solid var(--border)", padding:"6px 10px", borderRadius:999}}>{data.reduce((a,s)=>a+s.topic_count,0)} Topics | {data.reduce((a,s)=>a+s.subtopic_count,0)} Subtopics</div>
    </div>
    <div style={{marginTop:14}}>
      <SyllabusTree data={data} setPage={setPage}/>
    </div>
  </div>;
}
