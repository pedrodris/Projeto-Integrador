import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type ProtectedRouteProps = {
  requiresProfile?: boolean;
};

export default function ProtectedRoute({
  requiresProfile = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasProfile } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiresProfile && !hasProfile) {
    return <Navigate to="/profile/setup" replace />;
  }

  return <Outlet />;
}
