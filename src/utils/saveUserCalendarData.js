import { userCollectionId, DBId, databases } from "../lib/appwrite";

async function saveUserCalendarData(newCalendarData, userFromSession) {
  console.log("newCalendarData", newCalendarData);
  if (newCalendarData.length === 0) {
    console.error("Error: newCalendarData is empty");
    return;
  }
  try {
    await databases.updateDocument(DBId, userCollectionId, userFromSession.$id, {
      calendarData: JSON.stringify(newCalendarData),
    });
    console.log("Calendar data updated successfully!", newCalendarData);
  } catch (error) {
    console.error("Error updating calendar data:", error);
    throw error; // You might want to handle the error appropriately in the calling code
  }
}

export default saveUserCalendarData