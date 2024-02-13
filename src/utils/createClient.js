import { clientCollectionId, DBId, databases } from "../lib/appwrite";
import { ID } from "appwrite";
// I will need to import appwrite.

export async function createClient(formData) {
  databases.createDocument(DBId, clientCollectionId, ID.unique(), {
    name : formData.name,
    address : `${formData.address.number} ${formData.address.street}, ${formData.address.zip}, ${formData.address.city}, ${formData.address.country}`,
    phone : formData.phone,
  });
}

