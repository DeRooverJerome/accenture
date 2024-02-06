import { useEffect, useState } from "react";
import { listDocuments } from "../lib/appwrite";
import Calendar from "../components/calendar.jsx";

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
    <div>
      <h1>Admin Page</h1>
      {documents.map((document, index) => (
        <div key={index}>
          <p>{document.username}</p>
          <p>{document.address ? document.address : "No address found"}</p>
          <Calendar user={ document }/>
        </div>
      ))}
    </div>
  );
}

export default Admin;
