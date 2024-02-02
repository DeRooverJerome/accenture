// AuthContext.js

import { createContext, useState, useEffect, useContext } from "react";
import { account, databases } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
const DBId = '65a68ade63aa62ea29c5'
const CollectionId = '65b3b155c0c6d05b439a'

const AuthContext = createContext();

async function createUser(username, userID) {
  /* const blankCalendar = generateYear(); */
  databases.createDocument(DBId, CollectionId, userID, {
    username: username,
    /* calendarData: JSON.stringify(blankCalendar), */
  });
}

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const loginUser = async (userInfo) => {
    setLoading(true);

    try {
      let response = await account.createEmailSession(
        userInfo.email,
        userInfo.password
      );
      let accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const logoutUser = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  const registerUser = async (userInfo) => {
    setLoading(true);

    try {
      // Create Appwrite account
      let response = await account.create(
        ID.unique(),
        userInfo.email,
        userInfo.password1,
        userInfo.name
      );
      
      // Create a user document in the "Users" collection
      await createUser(userInfo.name, response.$id);

      // Log in the user
      await account.createEmailSession(userInfo.email, userInfo.password1);
      let accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const checkUserStatus = async () => {
    try {
      let accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

/*   const createUser = async (username) => {
    const blankCalendar = generateYear();
    await databases.createDocument("Users", {
      userId: user.$id, // Link to the logged-in user
      username: username,
      calendarData: JSON.stringify(blankCalendar),
    });
  };
 */
  const contextData = {
    user,
    loginUser,
    logoutUser,
    registerUser,
    createUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
