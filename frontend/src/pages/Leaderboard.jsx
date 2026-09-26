import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/progressApi";
export default function Leaderboard(){
  const [lb,setLb]=useState([]);
  useEffect(()=>{ getLeaderboard().then(setLb);},[]);
  return <div className="container"><h2>Leaderboard</h2>{lb.map(u=><div key={u.rank}>#{u.rank} {u.name} - {u.xp} XP</div>)}</div>;
}

