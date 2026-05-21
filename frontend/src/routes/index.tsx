import { BrowserRouter, Route, Routes } from "react-router-dom";

import RequireAuth from "../auth/RequireAuth";
import Dashboard from "../pages/Dashboard";
import DietPlanCreate from "../pages/DietPlanCreate";
import DietPlans from "../pages/DietPlans";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyDiet from "../pages/MyDiet";
import ProfileSetup from "../pages/ProfileSetup";
import Register from "../pages/Register";
import ShoppingList from "../pages/ShoppingList";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/profile/setup" element={<ProfileSetup />} />
          <Route path="/app/dietas" element={<DietPlans />} />
          <Route path="/app/dietas/nova" element={<DietPlanCreate />} />
          <Route path="/app/minha-dieta" element={<MyDiet />} />
          <Route path="/app/lista-de-compras" element={<ShoppingList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
