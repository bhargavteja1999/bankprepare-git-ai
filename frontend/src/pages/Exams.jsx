import { useEffect, useState } from "react";
import { getExams } from "../services/examApi";
export default function Exams(){
  const [exams,setExams]=useState([]);
  useEffect(()=>{ getExams().then(setExams);},[]);
  return <div className="container"><h2>Exams</h2>{exams.map(e=><div key={e.id} className="card"><h3>{e.name}</h3><p>{e.description||e.subject}</p></div>)}</div>;
}
