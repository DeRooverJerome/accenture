import React, { useState, useRef, useEffect } from "react";
import { getUserData } from "../utils/getUserData";
import saveUserClients from "../utils/saveUserClients";

const AddClients = ({ clients, user, onAddClient }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const autocompleteRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Filter clients based on the input value
    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const handleAddClick = async () => {
    if(inputValue === "") {
      return;
    }
    const filtered = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    if (filtered.length > 0) {
      const newClientId = filtered[0].$id;
      const userData = await getUserData(user.$id);
      const userClientsData = JSON.parse(userData.clients);
      
      if (!userClientsData.includes(newClientId)) {
        userClientsData.push(newClientId);
        console.log(userClientsData);
        const dataToSave = JSON.stringify(userClientsData);
        await saveUserClients(dataToSave, user.$id);
        onAddClient();
      } else {
        console.log("Client already exists in user's list.");
      }
    } else {
      console.log("No matching client found.");
    }
    
    setInputValue("");
  };
  
  const handleClientClick = (name) => {
    setInputValue(name);
    setFilteredClients([]);
  };

  const handleClickOutside = (event) => {
    if (
      autocompleteRef.current &&
      !autocompleteRef.current.contains(event.target)
    ) {
      setFilteredClients([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <h2 className="pb-2 font-semibold text-lg">Add a client</h2>   
        <input
        type="text"
        className="inputClients my-0 z-40 border-gray-300 border rounded px-4 py-2 w-full text-normal font-sans"
        placeholder="Type the client name..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <div
        className="autocomplete border-l border-r rounded -translate-y-1 absolute w-full z-30"
        ref={autocompleteRef}
      >
        {filteredClients.map((client, index) => (
          <div
            key={index}
            className={`option p-2 border-b border-black border-opacity-20 transition-all bg-white hover:cursor-pointer${
              index === 0 ? " pt-4" : "" // Add padding-top 4 to the first filtered client
            }`}
            onClick={() => handleClientClick(client.name)}
          >
            {client.name}
          </div>
        ))}
      </div>
      <button className="addClientsBtn" onClick={handleAddClick}>
        Add
      </button>
    </div>
  );
};

export default AddClients;
