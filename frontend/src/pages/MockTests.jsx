import { useEffect, useState } from "react";
import { getMocks, startMock } from "../services/mockApi";
export default function MockTests(){
  const [mocks,setMocks]=useState([]);
  useEffect(()=>{ getMocks().then(setMocks);},[]);
  return <div className="container"><h2>Mock Tests</h2>{mocks.map(m=><div key={m.id} className="card"><h3>{m.title}</h3><button className="btn-primary" onClick={()=>startMock(m.id)}>Start</button></div>)}</div>;
}
