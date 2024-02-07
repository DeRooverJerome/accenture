import { CollectionId, DBId, databases } from "../lib/appwrite";

async function saveUserBonusData(newBonusData, userID) {
  try {
    await databases.updateDocument(DBId, CollectionId, userID, {
      isBonus: newBonusData,
    });
    console.log("Calendar data updated successfully!", newBonusData);
  } catch (error) {
    console.error("Error updating calendar data:", error);
    throw error; // You might want to handle the error appropriately in the calling code
  }
}

export default saveUserBonusData;