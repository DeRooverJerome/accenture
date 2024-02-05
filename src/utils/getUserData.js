import { CollectionId, DBId, databases } from "../lib/appwrite";
// I will need to import appwrite.
// This is only for testing purposes the exampleUserId will be replaced with the actual user id.

export async function getUserDataFromSession(userFromSession) {
  return databases.getDocument(DBId, CollectionId, userFromSession.$id);
}

// export async function getUserDataFromSession(userFromSession) {
//   const response = await databases.getDocument(
//     DBId,
//     CollectionId,
//     userFromSession.$id
//   );
//   return response;
// }

// export async function getUserData(userId) {
//   const secondResponse = await databases.getDocument(DBId, CollectionId, userId);
//   return secondResponse;
// }



