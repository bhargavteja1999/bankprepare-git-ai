import { useEffect, useState } from "react";
import { getCurrentAffairs } from "../services/currentAffairsApi";
export default function CurrentAffairs(){
  const [cas,setCas]=useState([]);
  useEffect(()=>{ getCurrentAffairs(5).then(setCas);},[]);
  return <div className="container"><h2>Current Affairs</h2>{cas.map(c=><div key={c.id} className="card"><h3>{c.title}</h3><p>{c.summary}</p></div>)}</div>;
}
