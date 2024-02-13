import { clientCollectionId, DBId, databases } from "../lib/appwrite";
import { listUsers } from "../lib/appwrite"; // Import the function to list users
import saveUserClients from "./saveUserClients";

export async function deleteClient(clientID) {
  try {
    console.log("clientID", clientID);
    // Delete the client document
    await databases.deleteDocument(DBId, clientCollectionId, clientID);
    console.log("Document deleted successfully");

    // Get all users
    const usersResponse = await listUsers();
    const users = usersResponse.documents; // Access the documents array
    console.log(users)

    for (const user of users) {
      console.log("user.clients", user.clients); // Log the value of user.clients
      
      // Parse the clients property array if it's a valid JSON string
      let clients = [];
      if (typeof user.clients === "string") {
        try {
          clients = JSON.parse(user.clients);
        } catch (error) {
          console.error("Error parsing clients JSON:", error);
        }
      }
      console.log("clients", clients)

      // Filter out the clientID from the array if it exists
      const updatedClients = clients.filter(id => id !== clientID);

      // Stringify the modified array
      const updatedClientsString = JSON.stringify(updatedClients);
      console.log("updatedClientsString", updatedClientsString)

      // Update the user document with the modified clients property
      await saveUserClients(updatedClientsString, user.$id);

      console.log(`User document ${user.$id} updated successfully`);
    }

  } catch (error) {
    console.error("Error deleting document:", error);
  }
}
