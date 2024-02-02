import { useAuth } from "../utils/AuthContext";

function Home() {
  const { user } = useAuth();
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>For Employees Only</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Home;
