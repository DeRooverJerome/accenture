import { useState, useEffect } from 'react';
import { client } from '../lib/appwrite';

const DocumentList = () => {
  const [documentIds, setDocumentIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.database.listDocuments('your-collection-id', ['*'], 100, 0, 'id', 'DESC');
        setDocumentIds(response.documents.map(doc => doc.$id));
      } catch (error) {
        console.error('Error fetching document IDs:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Document IDs</h2>
      <ul>
        {documentIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;

