import { userCollectionId, DBId, databases } from "../lib/appwrite";

async function saveUserBonusData(newClientData, userID) {
  try {88
    await databases.updateDocument(DBId, userCollectionId, userID, {
      clients: newClientData,
    });
    console.log("Calendar data updated successfully!", newClientData);
  } catch (error) {
    console.error("Error updating calendar data:", error);
    throw error; // You might want to handle the error appropriately in the calling code
  }
}

export default saveUserBonusData;