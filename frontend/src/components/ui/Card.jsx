export default function Card({ children, className="", hover=true, style, onClick }) {
  return <div className={`card ${className}`} style={style} onClick={onClick}>{children}</div>;
}
export function StatCard({ icon, label, value, sub, color="#4F46E5" }) {
  return (
    <div className="stat">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:11, fontWeight:700, letterSpacing:"0.06em", color:"var(--text-faint)", textTransform:"uppercase"}}>{label}</div>
          <strong style={{marginTop:4, color:"var(--text)"}}>{value}</strong>
          {sub && <div style={{fontSize:11, color:"var(--text-muted)", marginTop:2}}>{sub}</div>}
        </div>
        <div style={{width:36,height:36,borderRadius:10, background:`${color}18`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16}}>{icon}</div>
      </div>
    </div>
  );
}
