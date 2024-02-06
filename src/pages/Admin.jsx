import { useEffect, useState } from "react";
import { listDocuments } from "../lib/appwrite";
import Calendar from "../components/calendar.jsx";
import UserSort from "../components/UserSort.jsx";

function Admin() {
  const [documents, setDocuments] = useState([]);

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
    <div className="adminPage">
      <div className="adminContainer">

      <div className="userInfos">
      <UserSort />
      </div>
      <div className="calendar">
      {documents.map((document, index) => (
        <div key={index}>
          <Calendar user={ document }/>
        </div>
      ))}
      </div>
      </div>
    </div>
  );
}

export default Admin;
