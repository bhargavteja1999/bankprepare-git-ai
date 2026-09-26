import { useEffect, useState } from "react";
import { getPlan } from "../services/studyPlanApi";
export default function StudyPlan(){
  const [plan,setPlan]=useState(null);
  useEffect(()=>{ getPlan().then(setPlan).catch(()=>{});},[]);
  return <div className="container"><h2>Study Plan</h2>{plan?<pre>{JSON.stringify(plan,null,2)}</pre>:<p>No plan - generate one.</p>}</div>;
}

