import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export default function Register(){
  const { register } = useAuth();
  const [name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[err,setErr]=useState("");
  const submit=async(e)=>{ e.preventDefault(); try{ await register(name,email,password); }catch(ex){ setErr(ex.response?.data?.detail||ex.message); }};
  return <div className="container" style={{maxWidth:400}}><h2>Register</h2><form onSubmit={submit}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" style={{width:"100%",marginTop:8,padding:10}}/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",marginTop:8,padding:10}}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (8+ chars, mixed)" style={{width:"100%",marginTop:8,padding:10}}/><button className="btn-primary" style={{width:"100%",marginTop:12}}>Register</button>{err&&<p style={{color:"#dc2626"}}>{err}</p>}</form></div>;
}
