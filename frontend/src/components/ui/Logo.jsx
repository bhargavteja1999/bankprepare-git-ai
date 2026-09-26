export default function Logo({ size=38, withText=true }){
  const s = size;
  return (
    <div style={{display:"flex", gap:10, alignItems:"center"}}>
      <div style={{width:s, height:s, borderRadius: s*0.28, background:"linear-gradient(135deg,#4F46E5 0%, #38BDF8 100%)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 20px rgba(79,70,229,0.35)", position:"relative", flexShrink:0, padding: s*0.12}}>
        <svg viewBox="0 0 32 32" width={s*0.76} height={s*0.76} style={{display:"block"}}>
          <defs>
            <linearGradient id={`sg-${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#E0E7FF"/>
            </linearGradient>
          </defs>
          <path d="M16 5.5 L24.5 10.2 L24.5 16.8 C24.5 20.8 21.2 24.2 16 27 L10.8 24.2 C7.2 21.8 7.5 16.8 7.5 16.8 L7.5 10.2 Z" fill={`url(#sg-${s})`} stroke="rgba(255,255,255,0.9)" strokeWidth="0.6"/>
          <path d="M16 8.5 L9.5 12 L10.5 12 L16 9.2 L21.5 12 L22.5 12 Z" fill="#4F46E5"/>
          <rect x="9.8" y="13.2" width="1.9" height="6.2" rx="0.4" fill="#4F46E5"/>
          <rect x="12.7" y="13.2" width="1.9" height="6.2" rx="0.4" fill="#4F46E5"/>
          <rect x="15.05" y="13.2" width="1.9" height="6.2" rx="0.4" fill="#4338CA"/>
          <rect x="17.4" y="13.2" width="1.9" height="6.2" rx="0.4" fill="#4F46E5"/>
          <rect x="20.3" y="13.2" width="1.9" height="6.2" rx="0.4" fill="#4F46E5"/>
          <rect x="9.5" y="20" width="13" height="1.6" rx="0.5" fill="#4F46E5"/>
          <g transform="translate(25.5,6.5)">
            <circle r="4.2" fill="white" stroke="#E0E7FF" strokeWidth="0.7"/>
            <path d="M0 -2.2 L0.5 -0.5 L2.2 0 L0.5 0.5 L0 2.2 L-0.5 0.5 L-2.2 0 L-0.5 -0.5 Z" fill="#4F46E5"/>
          </g>
        </svg>
      </div>
      {withText && (
        <div>
          <div style={{fontFamily:"Poppins, sans-serif", fontWeight:800, fontSize:15, letterSpacing:"-0.02em", lineHeight:1, color:"var(--text)"}}>BankPrepare AI</div>
          <div style={{fontSize:10, fontWeight:700, letterSpacing:"0.08em", color:"var(--accent)", marginTop:2}}>IBPS | SBI | RBI</div>
        </div>
      )}
    </div>
  );
}
