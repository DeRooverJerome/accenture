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
import { listDocuments } from "../lib/appwrite";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useAuth } from "../utils/AuthContext";
import UserSort from "../components/UserSort";

const Admin = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  useEffect(() => {
    listDocuments()
      .then((response) => {
        setDocuments(response.documents);
        console.log(response.documents);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
      <div>
        <div>
          <UserSort />
        </div>
        <div>
          {documents.map((document, index) => (
            <div key={index}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
