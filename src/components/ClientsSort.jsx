import { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Modal, Select } from "antd";
const bottomOptions = [
  {
    label: 'bottomLeft',
    value: 'bottomLeft',
  },
  {
    label: 'bottomCenter',
    value: 'bottomCenter',
  },
  {
    label: 'bottomRight',
    value: 'bottomRight',
  },
  {
    label: 'none',
    value: 'none',
  },
];
import Highlighter from "react-highlight-words";
import { listClients } from "../lib/appwrite";
import NewClientModal from "./newClientModal";

const ClientsSort = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserClients, setSelectedUserClients] = useState([]);
  const [bottom, setBottom] = useState('bottomCenter');

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
    /* LastName: document.LastName, */
    /* FirstName: document.FirstName, */
    Name: document.name,
    Address: document.address,
    phone: document.phone,
    /* isBonus: document.isBonus, */
    /* Clients: document.clients, */
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
  const columns = [
    {
      title: "Company Name",
      dataIndex: "Name",
      key: "Name",
      width: "30%",
      ...getColumnSearchProps("Name"),
    },
    {title: "Address", dataIndex: "Address", key: "Address", width: "30%"},
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
          columns={columns}
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
      <div className="flex-1 flex justify-center items-center">
      <NewClientModal updateClientData={updateClientData}/>
      </div>
    </div>
  );
};

export default ClientsSort;
