import React, { useState, useRef } from 'react';
import { createClient } from '../utils/createClient';

const NewClientModal = ({ updateClientData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: {
            number: '',
            street: '',
            zip: '',
            city: '',
            country: ''
        }
    });

    const modalRef = useRef();

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setFormData({
            name: '',
            phone: '',
            address: {
                number: '',
                street: '',
                zip: '',
                city: '',
                country: ''
            }
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
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
          console.log("formData", formData)
          await createClient(formData);
          updateClientData(formData);
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
                <div className="py-2 px-4 border-lime-600 border-2 border-opacity-50 rounded-2xl hover:bg-lime-600 hover:bg-opacity-30">
                    <span className="text-3xl text-lime-600 pr-2">+</span>
                    <span className="text-2xl text-lime-600">Add a client</span>
                </div>
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30" onClick={handleClickOutside}>
                    <div className="p-8 bg-neutral-100 rounded-2xl shadow-lg flex flex-col w-screen max-w-96" ref={modalRef}>
                        <h2 className="text-2xl font-bold mb-4">New Client</h2>
                        <form onSubmit={handleSubmit} className='flex flex-col'>
                            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="border border-gray-300 rounded px-4 py-2 mb-4" />
                            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="border border-gray-300 rounded px-4 py-2 mb-4" />
                            <h3 className="text-lg font-bold mb-2">Address</h3>
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

export default NewClientModal;
