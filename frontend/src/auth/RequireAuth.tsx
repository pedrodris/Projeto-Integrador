import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./useAuth";

export default function RequireAuth() {
  const { session } = useAuth();
  const location = useLocation();

  // TODO: reabilitar autenticação antes do deploy
  // if (!session) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  return <Outlet />;
}
