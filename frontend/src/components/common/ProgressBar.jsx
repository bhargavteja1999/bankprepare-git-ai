export default function ProgressBar({ value=0 }) {
  return <div style={{height:8, background:"#e2e8f0", borderRadius:999, overflow:"hidden"}}><div style={{width:`${Math.min(100, value)}%`, height:"100%", background:"#0f4c81", borderRadius:999}}/></div>;
}
