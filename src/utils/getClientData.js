import { DBId, databases } from "../lib/appwrite";
const CollectionId = "65c0a8f5eb3043371810";
// I will need to import appwrite.
// This is only for testing purposes the exampleUserId will be replaced with the actual user id.

export async function getClientsData(clients) {
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
  ;}
