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
    <div >
      <div>
      <div >
      <UserSort />
      </div>
      <div >
      {documents.map((document, index) => (
        <div key={index}>
        </div>
      ))}
      </div>
      </div>
    </div>
  );
}

export default Admin;
