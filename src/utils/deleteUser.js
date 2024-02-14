import { userCollectionId, DBId, databases } from "../lib/appwrite";

export async function deleteUser(userID) {
  try {
    console.log("userID", userID);
    // Delete the client document
    await databases.deleteDocument(DBId, userCollectionId, userID);
    console.log("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}
