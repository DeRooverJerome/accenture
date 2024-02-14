import { useState, useRef } from "react";
import { createUser } from "../utils/createUser";
import { regiserFromAdmin } from "../utils/createUser";

const NewEmployeeModal = ({ updateUserData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
      firstName: "",
      lastName: "",
      email: "",
      calendar: [],
      address: 
        {
          number: "",
          street: "",
          zip: "",
          city: "",
          country: "",
        },
      clients: [],
      company: "Accenture",
  });

  const modalRef = useRef();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      calendar: [],
      address: 
        {
          number: "",
          street: "",
          zip: "",
          city: "",
          country: "",
        },
      clients: [],
      company: "Accenture",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [name]: value
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          console.log("formData", formData);
          regiserFromAdmin(formData);
          /* updateUserData(formData); */
          closeModal();
        } catch (error) {
          console.error(error);
        }
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeModal();
        }
    };

    return (
        <div>
            <button onClick={openModal}>
                <div className=" my-2 py-1 px-2 border-lime-600 border-2 border-opacity-50 rounded-lg hover:bg-lime-600 hover:bg-opacity-30 mt-2">
                    <span className="text-2xl text-lime-600 pr-2">+</span>
                    <span className="text-xl text-lime-600">New Employee</span>
                </div>
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30" onClick={handleClickOutside}>
                    <div className="p-8 bg-neutral-100 rounded-2xl shadow-lg flex flex-col w-screen max-w-96" ref={modalRef}>
                        <h2 className="text-2xl font-bold mb-4">New Employee</h2>
                        <form onSubmit={handleSubmit} className='flex flex-col'>
                            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="border border-gray-300 rounded px-4 py-2 mb-4" />
                            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="border border-gray-300 rounded px-4 py-2 mb-4" />
                            <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="border border-gray-300 rounded px-4 py-2 mb-4" />
                            <input type="text" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="border border-gray-300 rounded px-4 py-2 mb-4" />
                            <h3 className="text-lg font-bold mb-2">Full Address</h3>
                            <input type="text" name="country" placeholder="Country" value={formData.address.country} onChange={handleAddressChange} className="border border-gray-300 rounded px-4 py-2 mb-2" />
                            <input type="text" name="city" placeholder="City" value={formData.address.city} onChange={handleAddressChange} className="border border-gray-300 rounded px-4 py-2 mb-2" />
                            <input type="text" name="zip" placeholder="ZIP Code" value={formData.address.zip} onChange={handleAddressChange} className="border border-gray-300 rounded px-4 py-2 mb-2" />
                            <input type="text" name="street" placeholder="Street Name" value={formData.address.street} onChange={handleAddressChange} className="border border-gray-300 rounded px-4 py-2 mb-2" />
                            <input type="text" name="number" placeholder="Street number" value={formData.address.number} onChange={handleAddressChange} className="border border-gray-300 rounded px-4 py-2 mb-4" />
                            <button type="submit" className="bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded my-2 mx-4">Save</button>
                            <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-2 mx-4" onClick={closeModal}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>   
  );
};

export default NewEmployeeModal;
