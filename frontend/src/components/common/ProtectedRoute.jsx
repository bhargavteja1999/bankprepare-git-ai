import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function ProtectedRoute({ children }) {
  const { isLogged } = useAuth();
  if (!isLogged) return <Navigate to="/login" replace />;
  return children;
}
