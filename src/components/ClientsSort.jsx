import { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Modal, Select } from "antd";
import { deleteClient }  from "../utils/deleteClient";
import Highlighter from "react-highlight-words";
import { listClients } from "../lib/appwrite";
import NewClientModal from "./NewClientModal";

const bottomOptions = [
  {
    label: "bottomLeft",
    value: "bottomLeft",
  },
  {
    label: "bottomCenter",
    value: "bottomCenter",
  },
  {
    label: "bottomRight",
    value: "bottomRight",
  },
  {
    label: "none",
    value: "none",
  },
];

const ClientsSort = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserClients, setSelectedUserClients] = useState([]);
  const [bottom, setBottom] = useState("bottomCenter");
  const [showDeleteColumn, setShowDeleteColumn] = useState(false); // New state to toggle the delete column

  useEffect(() => {
    listClients()
      .then((response) => {
        setDocuments(response.documents);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedUserClients, isModalOpen]);

  const updateClientData = (newClientData) => {
    const address = `${newClientData.address.number} ${newClientData.address.street}, ${newClientData.address.zip} ${newClientData.address.city}, ${newClientData.address.country}`;
    newClientData.address = address;
    setDocuments([...documents, newClientData]);
  };

  const arrayUser = documents.map((document, index) => ({
    key: index,
    $id: document.$id,
    Name: document.name,
    Address: document.address,
    phone: document.phone,
  }));

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deleteColumn = {
    title: "-",
    dataIndex: "delete",
    key: "delete",
    render: (text, record) => <button className="bg-red-600 bg-opacity-55 px-1 rounded-md border-red-800 border-2" onClick={() => handleDelete(record)}>Delete</button>,
    width: "10%",
  };

  const handleDelete = async (record) => {
    console.log("Deleting row with ID:", record.$id);
  
    try {
      await deleteClient(record.$id);
      console.log("Client deleted successfully");
  
      // Refetch client data from the database
      const response = await listClients();
      setDocuments(response.documents);
      alert("Client deleted successfully");
  
    } catch (error) {
      console.error("Error deleting client:", error);
      // Handle error (e.g., show an error message)
    }
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "Name",
      key: "Name",
      width: "30%",
      ...getColumnSearchProps("Name"),
    },
    { title: "Address", dataIndex: "Address", key: "Address", width: "30%" },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      width: "30%",
    },
  ];

  return (
    <div className="adminContainer mt-10 flex-col lg:flex-row">
      <div className="userInfos flex-1 main-component">
        <Table
          rowClassName={(record, rowIndex) =>
            rowIndex === selectedUser ? "selected-row" : ""
          }
          dataSource={arrayUser}
          columns={showDeleteColumn ? [...columns, deleteColumn] : columns} // Conditional rendering of delete column
          pagination={{
            position: ["none", "bottomCenter"],
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                setSelectedUser(record);
                console.log(record);
              },
            };
          }}
        />
      </div>
      <div className="flex-1 flex justify-center items-center flex-col">
       
        {/* Toggling the state to show or hide delete column */}
        {/* <NewClientModal updateClientData={updateClientData} /> */}
        <button
          className="py-2 px-4 border-red-600 border-2 border-opacity-50 rounded-2xl hover:bg-red-600 hover:bg-opacity-30 mb-4 min-w-52 my-4"
          onClick={() => setShowDeleteColumn(!showDeleteColumn)}
        >
          <span className="text-3xl text-red-600 pr-2">-</span>
          <span className="text-2xl text-red-600">Delete a client</span>
        </button>{" "}
      </div>
    </div>
  );
};

export default ClientsSort;
