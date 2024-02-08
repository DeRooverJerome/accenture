import { useAuth } from "../utils/AuthContext";
import Calendar from "../components/calendar.jsx";
import Header from "../components/Header.jsx";
import "../../public/css/style.css";

function Home() {
  const { user } = useAuth();
  return (
    <div>
      <Header />

      <div className="container">
        <Calendar user={user} />
      </div>
    </div>
  );
}

export default Home;
