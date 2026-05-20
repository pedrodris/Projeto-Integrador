import { BrowserRouter, Route, Routes } from "react-router-dom";

import RequireAuth from "../auth/RequireAuth";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import ProfileSetup from "../pages/ProfileSetup";
import Register from "../pages/Register";
import Home from "../pages/Home";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/profile/setup" element={<ProfileSetup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
