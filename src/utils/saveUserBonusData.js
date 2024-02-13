import { userCollectionId, DBId, databases } from "../lib/appwrite";

async function saveUserBonusData(newBonusData, userID, displayMonth) {
  console.log(displayMonth)
  if(displayMonth.length < 28) {
    console.log("Error: not updating bonus data. displayMonth is empty");
    return;
  }
  try {
    await databases.updateDocument(DBId, userCollectionId, userID, {
      isBonus: newBonusData,
    });
    console.log("Bonus data updated successfully!", newBonusData);
  } catch (error) {
    console.error("Error updating calendar data:", error);
    throw error; // You might want to handle the error appropriately in the calling code
  }
}

export default saveUserBonusData;