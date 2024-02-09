import { userCollectionId, DBId, databases } from "../lib/appwrite";
import { ID } from "appwrite";
import { generateYear } from "./dayjsFunctions";
// I will need to import appwrite.

export async function createUser(username, userID) {
  const blankCalendar = generateYear();
  databases.createDocument(DBId, userCollectionId, userID, {
    username: username,
    calendarData: JSON.stringify(blankCalendar),
    clients : "",
    address : "",
  });
}

