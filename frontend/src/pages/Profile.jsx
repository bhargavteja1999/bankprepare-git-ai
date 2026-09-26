import { useAuth } from "../context/AuthContext";
export default function Profile(){
  const { user, logout }=useAuth();
  return <div className="container"><h2>Profile</h2><p>{user?.name} | {user?.email}</p><button className="btn-outline" onClick={logout}>Logout</button></div>;
}

