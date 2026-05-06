import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, isLoading, hasProfile } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to={hasProfile ? "/dashboard" : "/profile/setup"} replace />;
}
