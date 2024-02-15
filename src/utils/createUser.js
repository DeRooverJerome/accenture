import { userCollectionId, DBId, databases } from "../lib/appwrite";
import { ID } from "appwrite";
import { generateYear } from "./dayjsFunctions";
import { account } from "../lib/appwrite";
import { calculateDistanceBetweenTwoAdresses } from "./geolocUtil";

export async function createUser(username, userID) {
  const blankCalendar = generateYear();
  databases.createDocument(DBId, userCollectionId, userID, {
    username: username,
    calendarData: JSON.stringify(blankCalendar),
    clients : "",
    address : "",
  });
}

export async function regiserFromAdmin (formData) {
  const {firstName, lastName, email, password, address} = formData;
  let userID = ""
  await account.create(ID.unique(), email, password, firstName).then(response => {
    console.log(response);
    userID = response.$id;
  }).catch(error => {
    console.log(error);
  });
  const officeAddress = 'Rue Picard 11, 1000 Bruxelles, Belgique'
  const adressString = `${address.number}, ${address.street}, ${address.zip}, ${address.city}, ${address.country}`;
  const distFromOffice = await calculateDistanceBetweenTwoAdresses(officeAddress, adressString);
  let isInRange = false;
  if (distFromOffice < 10) {
     isInRange = true;
  } else {
     isInRange = false;
  }

  await databases.createDocument(DBId, userCollectionId, userID, {
    FirstName: firstName,
    LastName: lastName,
    username : firstName,
    calendarData: JSON.stringify(generateYear()),
    clients : "",
    address : adressString,
    isInRange : isInRange,
    isBonus : false,
    Company: "Accenture"
    
  });
  window.location.reload();
}
