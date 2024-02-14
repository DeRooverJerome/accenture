import { useEffect, useState } from "react";
import { listUsers } from "../lib/appwrite";
import UserSort from "../components/UserSort.jsx";
import ClientsSort from "../components/ClientsSort.jsx"; // Import ClientsSort component
import { useAuth } from "../utils/AuthContext";

function Admin() {
  const { user, logoutUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [tableDisplay, setTableDisplay] = useState("users");

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  
  useEffect(() => {
    listUsers()
      .then((response) => {
        setDocuments(response.documents);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleTableDisplay = (table) => {
    return () => {
      setTableDisplay(table);
    };
  };

  return (
    <div>
      <button className="logoutAdmin" onClick={logoutUser}>
        Logout
      </button>
      <div className="w-11/12 mx-auto mt-10 ">
        <div className="text-lg flex mx-auto border-2 border-black border-opacity-30 max-w-fit hover:cursor-pointer mb-16">
          <h2
            className={`employeesSide border-r-2 py-2 min-w-40 text-center border-black border-opacity-30 hover:bg-black hover:bg-opacity-20  ${
              tableDisplay === "users" ? "selected bg-opacity-20 bg-black" : ""
            }`}
            onClick={handleTableDisplay("users")}
          >
            Employees
          </h2>
          <h2
            className={` clientsSide py-2 min-w-40 text-center  hover:bg-black hover:bg-opacity-20 ${
              tableDisplay === "clients"
                ? "selected bg-opacity-20 bg-black"
                : ""
            }`}
            onClick={handleTableDisplay("clients")}
          >
            Clients
          </h2>
        </div>
        {tableDisplay === "users" ? <UserSort /> : <ClientsSort />}
      </div>
    </div>
  );
}

export default Admin;
