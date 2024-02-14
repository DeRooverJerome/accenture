import { Client, Account, Databases } from "appwrite";

export const projectId = import.meta.env.PROJECT_ID;
export const DBId = import.meta.env.DATABASE_ID;
export const userCollectionId = import.meta.env.USER_COLLECTION_ID;
export const clientCollectionId = import.meta.env.CLIENT_COLLECTION_ID;

console.log("projectId", projectId);


const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(projectId);

export const databases = new Databases(client);
export { ID } from "appwrite";
export const account = new Account(client);
console.log("account", account);

export const listUsers = () => {
  return databases.listDocuments(DBId, userCollectionId);
};

export const listClients = () => {
  return databases.listDocuments(DBId, clientCollectionId);
};

export default client;
