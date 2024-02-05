import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoutes = () => {
  const { user } = useAuth();
  const isAdmin = user.email === "admin@admin.com";
  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoutes;
