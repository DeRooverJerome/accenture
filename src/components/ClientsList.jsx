import { useState, useEffect } from "react";
import { Select, Button } from "antd";
import saveUserClients from "../utils/saveUserClients";
import { Router } from "react-router-dom";

const { Option } = Select;

const ClientsList = ({ selectedUserClients, selectedUserID }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(""); // Add selectedValue state

  useEffect(() => {
    setOptions(selectedUserClients);
  }, [selectedUserClients]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddClick = () => {
    const newOption = { value: String(options.length + 1), name: inputValue };
    setOptions([...options, newOption]);
    setInputValue("");
  };

  const handleDeleteClick = async (valueToDelete) => {
    const newOptions = options.filter((item) => item.$id !== valueToDelete);
    setOptions(newOptions);

    const newOptionsIds = newOptions.map((item) => item.$id);
    const newOptionsIDsString = JSON.stringify(newOptionsIds);
    await saveUserClients(newOptionsIDsString, selectedUserID);
    Router.reload();

    // Update selectedValue when an option is deleted
    if (selectedValue === valueToDelete) {
      setSelectedValue("");
    }
  };

  return (
    <div>
      <input
        type="text"
        className="inputClients"
        placeholder="Type the client address..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <button className="addClientsBtn" onClick={handleAddClick}>
        Add
      </button>
      <div className="flex flex-col items-center my-2">
      <h3 className="text-lg">Delete clients</h3>
      <Select
        showSearch
        style={{
          width: 470,
          margin: "20px 0 0 0",
        }}
        placeholder="Search to Select"
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.children[0] ?? "").includes(input)
        }
        filterSort={(optionA, optionB) =>
          (optionA?.children[0] ?? "")
            .toLowerCase()
            .localeCompare((optionB?.children[0] ?? "").toLowerCase())
        }
        value={selectedValue} // Pass selectedValue as the value prop
      >
        {options.map((option) => (
          <Option key={option.$id} value={option.name} className="relative">
            {option.name}
            <Button
              className="deleteBtn absolute right-0"
              type="text"
              onClick={() => handleDeleteClick(option.$id)}
            >
              Delete
            </Button>
          </Option>
        ))}
      </Select>
      </div>
    </div>
  );
};

export default ClientsList;
