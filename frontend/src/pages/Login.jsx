import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Login(){
  const { login } = useAuth();
  const [email,setEmail]=useState("demo@bankprepare.ai");
  const [password,setPassword]=useState("demo123");
  const [err,setErr]=useState("");
  const nav = useNavigate();
  const submit=async(e)=>{ e.preventDefault(); try{ await login(email,password); nav("/dashboard"); }catch(ex){ setErr(ex.response?.data?.detail||ex.message); }};
  return <div className="container" style={{maxWidth:400}}><h2>Login</h2><form onSubmit={submit}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",marginTop:8,padding:10}}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{width:"100%",marginTop:8,padding:10}}/><button className="btn-primary" style={{width:"100%",marginTop:12}}>Login</button>{err&&<p style={{color:"#dc2626"}}>{err}</p>}</form></div>;
}
