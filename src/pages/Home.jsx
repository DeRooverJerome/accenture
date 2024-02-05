import { useAuth } from "../utils/AuthContext";
import Calendar from "../components/calendar.jsx";

function Home() {
  const { user } = useAuth();
  console.log(user)
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>For Employees Only</p>
      <p>Email: {user.email}</p>
      <Calendar user={ user }/>
    </div>
  );
}

export default Home;
