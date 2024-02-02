import { CollectionId, DBId, databases } from "../lib/appwrite";

async function saveUserCalendarData(newCalendarData, userFromSession) {
  try {
    await databases.updateDocument(DBId, CollectionId, userFromSession.$id, {
      calendarData: JSON.stringify(newCalendarData),
    });
    console.log("Calendar data updated successfully!");
  } catch (error) {
    console.error("Error updating calendar data:", error);
    throw error; // You might want to handle the error appropriately in the calling code
  }
}

export default saveUserCalendarData