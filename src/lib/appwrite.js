import { Client, Account, Databases } from "appwrite";


const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65a6865a10c75ad51a2a");

export const databases = new Databases(client);
export { ID } from "appwrite";
export const DBId = "65a68ade63aa62ea29c5";
export const userCollectionId = "65b3b155c0c6d05b439a";
export const clientCollectionId = "65c0a8f5eb3043371810";
export const exampleUserId = "65b6705e625fa85f2bba";
export const account = new Account(client);

export const listUsers = () => {
  return databases.listDocuments(DBId, userCollectionId);
};

export const listClients = () => {
  return databases.listDocuments(DBId, clientCollectionId);
};

export default client;
