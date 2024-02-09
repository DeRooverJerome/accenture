// import { useEffect, useState } from "react";
// import { listDocuments } from "../lib/appwrite";
// import UserSort from "../components/UserSort.jsx";

// function Admin() {
//   const [documents, setDocuments] = useState([]);

//   useEffect(() => {
//     listDocuments()
//       .then((response) => {
//         setDocuments(response.documents);
//         console.log(response.documents);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, []);
//   return (
//     <div>
//       <div>
//         <div>
//           <UserSort />
//         </div>
//         <div>
//           {documents.map((document, index) => (
//             <div key={index}></div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Admin;

import { useEffect, useState } from "react";
import { listUsers } from "../lib/appwrite";
import Calendar from "../components/calendar.jsx";
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
      setTableDisplay(table); // Update tableDisplay state based on clicked option
    };
  };

  return (
    <div>
      <button onClick={logoutUser}>Logout</button>
      <div className="w-11/12 mx-auto mt-10">
        <div className="w-full grid lg:grid-cols-2">
          <div className="text-lg col-start-1 flex justify-around mx-auto border-2 rounded-xl border-black border-opacity-30">
            <h2
              className={`border-r-2 py-2 min-w-40 text-center border-black border-opacity-30 hover:bg-black hover:bg-opacity-20 ${
                tableDisplay === "users" ? "selected" : ""
              }`}
              onClick={handleTableDisplay("users")}
            >
              Employees
            </h2>
            <h2
              className={`py-2 min-w-40 text-center  hover:bg-black hover:bg-opacity-20 ${
                tableDisplay === "clients" ? "selected" : ""
              }`}
              onClick={handleTableDisplay("clients")}
            >
              Clients
            </h2>
          </div>
        </div>
        {/* Conditionally render components based on tableDisplay state */}
        {tableDisplay === "users" ? <UserSort /> : <ClientsSort />}
      </div>
    </div>
  );
};

export default Admin;
