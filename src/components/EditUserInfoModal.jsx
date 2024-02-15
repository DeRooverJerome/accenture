import { useState, useEffect } from "react";

const EditUserInfoModal = ({ userData, onClose }) => {
    console.log(userData);
  const [firstName, setFirstName] = useState(userData.FirstName);
  const [lastName, setLastName] = useState(userData.LastName);
  const [address, setAddress] = useState(userData.address);

  const handleSave = () => {
    // Handle saving the changes, e.g., by calling an API
    // For simplicity, let's just log the changes for now
    console.log("New First Name:", firstName);
    console.log("New Last Name:", lastName);
    console.log("New Address:", address);
    onClose();
  };

  return (
    <div className="edit-user-info-modal fixed flex flex-col z-50 border-4 left-1/2 bg-white p-4 justify-between">
      <h2 className="underline mb-4">Edit User Information</h2>
      <label>
        First Name:
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="bg-gray-200 p-1 rounded-md w-full mb-2"
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="bg-gray-200 p-1 rounded-md w-full mb-2"

        />    
      </label>
      <label>
        Address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-gray-200 p-1 rounded-md w-full mb-2"

        />
      </label>
      <button onClick={handleSave} className="p-2 bg-blue-400 mt-2 w-1/2 m-auto rounded-md">Save Changes</button>
    </div>
  );
};

export default EditUserInfoModal;