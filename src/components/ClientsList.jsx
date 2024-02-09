import { useState, useEffect } from "react";
import { Select, Button } from "antd";


const { Option } = Select;

const ClientsList = () => {
  const [options, setOptions] = useState(() => {
    const savedOptions = localStorage.getItem("options");
    if (savedOptions) {
      return JSON.parse(savedOptions);
    } else {
      return [
        { value: "1", label: "Client 1" },
      ];
    }
  });

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddClick = () => {
    setOptions([
      ...options,
      { value: String(options.length + 1), label: inputValue },
    ]);
    setInputValue("");
  };

  const handleDeleteClick = (valueToDelete) => {
    setOptions(options.filter((option) => option.value !== valueToDelete));
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
      <Select
        key={options.length}
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
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
            <Button className="deleteBtn" type="text" onClick={() => handleDeleteClick(option.value)}>
              Delete
            </Button>

          </Option>
        ))}
      </Select>
    </div>
  );
};

export default ClientsList;
