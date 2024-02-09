import { DBId, databases } from "../lib/appwrite";
const CollectionId = "65c0a8f5eb3043371810";

export async function getClientsData(clients) {
  if (!clients || clients.trim() === '') {
    return []; // Return empty array if clients is empty or whitespace
  }

  const parsedClients = JSON.parse(clients);
  const clientsData = [];
  for (let i = 0; i < parsedClients.length; i++) {
    const client = parsedClients[i];
    const clientData = await databases.getDocument(DBId, CollectionId, client); 
    clientsData.push(clientData);
  }
  return clientsData;
}

export async function getClientData(clientId) {
  return databases.getDocument(DBId, CollectionId, clientId);
}