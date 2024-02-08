import { useAuth } from "../utils/AuthContext";
import Calendar from "../components/calendar.jsx";
import '../../public/css/style.css';

function Home() {
  const { user } = useAuth();
  return (
    <div className="container">
      <Calendar user={ user }/>
    </div>
  );
}

export default Home;
