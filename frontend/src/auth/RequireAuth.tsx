import { Outlet } from "react-router-dom";

// Auth check temporarily disabled for UI development
export default function RequireAuth() {
  return <Outlet />;
}
