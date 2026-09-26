import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../ui/Logo";

function ThemeToggleBtn(){
  const { theme, toggle } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${theme==="dark"?"light":"dark"} mode`} title={`Switch to ${theme==="dark"?"light":"dark"} mode`}>
      {theme==="dark" ? "☀️" : "🌙"}
    </button>
  );
}

const NAV_GROUPS = [
  { title:"LEARN", items:[
    {k:"practice", label:"Practice", icon:"📝", hint:"Indigo"},
    {k:"syllabus", label:"Syllabus", icon:"🗺️"},
    {k:"plan", label:"Study Plan", icon:"📅"},
    {k:"tutor", label:"AI Tutor", icon:"🧠", ai:true},
  ]},
  { title:"TEST", items:[
    {k:"mocks", label:"Mock Tests", icon:"🎯"},
    {k:"adaptive", label:"Adaptive Practice", icon:"⚡"},
    {k:"ca2", label:"Current Affairs", icon:"📰"},
  ]},
  { title:"ANALYZE", items:[
    {k:"progress", label:"Progress", icon:"📊"},
    {k:"mistakes", label:"Mistakes", icon:"🧠"},
    {k:"review", label:"Review", icon:"🔁"},
  ]},
  { title:"COMPETE", items:[
    {k:"tournament", label:"Tournament", icon:"🏆"},
    {k:"leaderboard", label:"Leaderboard", icon:"🥇"},
  ]},
  { title:"FUN", items:[
    {k:"games", label:"Games", icon:"🎮"},
    {k:"ca", label:"CA Daily", icon:"📌"},
  ]},
];

export function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-scroll">
        <div className="brand" onClick={()=>setPage("dashboard")} style={{cursor:"pointer"}}>
          <Logo size={38} />
        </div>
        <div onClick={()=>setPage("dashboard")} className={`nav-item ${page==="dashboard"?"active":""}`} style={{marginBottom:14}}>
          <span className="ico">🏠</span> Dashboard
          <span style={{marginLeft:"auto", fontSize:10, background:"var(--primary)", color:"#fff", padding:"2px 6px", borderRadius:999, fontWeight:800}}>AI</span>
        </div>
        {NAV_GROUPS.map(g=>(
          <div key={g.title} className="nav-group">
            <div className="nav-group-title">{g.title}</div>
            {g.items.map(it=>(
              <div key={it.k} onClick={()=>setPage(it.k)} className={`nav-item ${page===it.k?"active":""}`}>
                <span className="ico">{it.icon}</span> {it.label}
                {it.ai && <span style={{marginLeft:"auto", width:6,height:6, borderRadius:"50%", background:"#38BDF8", boxShadow:"0 0 8px rgba(56,189,248,0.8)"}}/>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{padding:"12px 14px", borderTop:"1px solid var(--border)", display:"flex", gap:8, alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <div style={{width:8,height:8, borderRadius:"50%", background:"#22C55E", boxShadow:"0 0 8px rgba(34,197,94,0.6)"}}/>
          <span style={{fontSize:11, fontWeight:700, color:"var(--text-muted)"}}>AI ONLINE | Gemini Ready</span>
        </div>
        <ThemeToggleBtn />
      </div>
    </aside>
  );
}

export function Topbar({ page, setPage, onMenu, onLogout }) {
  const { user, logout } = useAuth();
  const titles = { dashboard:"Dashboard", practice:"Practice", mocks:"Mock Tests", adaptive:"Adaptive Practice", ca2:"Current Affairs", ca:"CA Daily", progress:"Progress", mistakes:"Mistake Notebook", review:"Review", tournament:"Weekly Tournament", leaderboard:"Leaderboard", games:"Games", syllabus:"Syllabus", tutor:"AI Tutor", plan:"Study Plan" };
  const title = titles[page] || "BankPrepare AI";
  const displayName = user?.name || (()=>{ try{return JSON.parse(localStorage.getItem("bp_user")||"null")?.name}catch{return null}})() || "Aspirant";
  const handleLogout = ()=>{
    try{ logout(); }catch{}
    if(onLogout) onLogout();
    else setPage("landing");
  };
  return (
    <header className="topbar">
      <div style={{display:"flex", gap:12, alignItems:"center"}}>
        <button className="mobile-menu-btn" onClick={onMenu} aria-label="Menu">☰</button>
        <div>
          <div className="topbar-title">{title}</div>
          <div className="topbar-sub">Premium AI | Serious preparation</div>
        </div>
      </div>
      <div style={{display:"flex", gap:10, alignItems:"center"}}>
        <ThemeToggleBtn />
        <div style={{textAlign:"right", display:"flex", flexDirection:"column"}}>
          <span style={{fontSize:13, fontWeight:700, color:"var(--text)"}}>{displayName}</span>
          <span style={{fontSize:11, color:"var(--text-muted)"}}>{user?.email || ""}</span>
        </div>
        <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
        <button className="btn-outline" style={{padding:"7px 12px", fontSize:12}} onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export function MobileDrawer({ open, onClose, page, setPage }) {
  if(!open) return null;
  return (
    <>
      <div className="drawer-overlay open" onClick={onClose} />
      <div className={`drawer ${open?"open":""}`}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
          <Logo size={32} />
          <div style={{display:"flex", gap:8, alignItems:"center"}}>
            <ThemeToggleBtn />
            <button className="btn-ghost" onClick={onClose}>✕</button>
          </div>
        </div>
        <div onClick={()=>{setPage("dashboard"); onClose();}} className={`nav-item ${page==="dashboard"?"active":""}`}>🏠 Dashboard</div>
        {NAV_GROUPS.map(g=>(
          <div key={g.title} className="nav-group">
            <div className="nav-group-title">{g.title}</div>
            {g.items.map(it=>(
              <div key={it.k} onClick={()=>{setPage(it.k); onClose();}} className={`nav-item ${page===it.k?"active":""}`}>
                <span className="ico">{it.icon}</span> {it.label}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default function AppShell({ page, setPage, children, isLogged, onLogout }) {
  const [drawer, setDrawer] = useState(false);
  if(!isLogged) return <>{children}</>;
  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <div style={{minWidth:0, display:"flex", flexDirection:"column"}}>
        <Topbar page={page} setPage={setPage} onMenu={()=>setDrawer(true)} onLogout={onLogout} />
        <MobileDrawer open={drawer} onClose={()=>setDrawer(false)} page={page} setPage={setPage} />
        <main className="main-content" style={{flex:1}}>
          {children}
        </main>
      </div>
    </div>
  );
}

