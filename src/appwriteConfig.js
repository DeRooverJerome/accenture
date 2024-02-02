import { Client, Account, Databases, Query } from "appwrite";

const client = new Client()
.setEndpoint("https://cloud.appwrite.io/v1")
.setProject("65bbba45c1f7ea29c151");


export const account = new Account(client);
export default client;
