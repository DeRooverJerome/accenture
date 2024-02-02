import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoutes = () => {
  const { user } = useAuth();
  const isAdmin = user.email === "admin@email.com";
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  return <Navigate to="/admin" />;
};

export default AdminRoutes;
