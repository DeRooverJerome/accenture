import { CollectionId, DBId, databases } from "../lib/appwrite";
// I will need to import appwrite.
// This is only for testing purposes the exampleUserId will be replaced with the actual user id.

export async function getUserDataFromSession(userFromSession) {
  return databases.getDocument(DBId, CollectionId, userFromSession.$id);
}
