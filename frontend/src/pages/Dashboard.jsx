import { useState, useEffect } from "react";
import { getProgress } from "../services/progressApi";
export default function Dashboard(){
  const [p,setP]=useState(null);
  useEffect(()=>{ getProgress().then(setP).catch(()=>{});},[]);
  if(!p) return <div className="container">Loading...</div>;
  return <div className="container"><h2>Dashboard</h2><p>{p.syllabus_covered}% covered | {p.accuracy}% accuracy</p></div>;
}

