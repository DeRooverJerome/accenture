import { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Modal, Select } from "antd";
import Highlighter from "react-highlight-words";
import { listClients, listUsers } from "../lib/appwrite";
import Calendar from "../components/calendar";
import ClientsList from "./ClientsList";
import AddClients from "./AddClients";
import { getUserData } from "../utils/getUserData";

const UserSort = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserClients, setSelectedUserClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [remountCalendar, setRemountCalendar] = useState(false);

  useEffect(() => {
    if (selectedUserClients.length > 0) {
      // Remount the calendar component
      setRemountCalendar((prevState) => !prevState);
    }
  }, [selectedUserClients]);

  useEffect(() => {
    console.log("selectedUserClients", selectedUserClients);
    listUsers()
      .then((response) => {
        setDocuments(response.documents);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedUserClients, isModalOpen]);

  useEffect(() => {
    const fetchAllClientsData = async () => {
      const allClientsData = await listClients();
      setAllClients(allClientsData.documents);
    };
    fetchAllClientsData();
  }, []);

  const arrayUser = documents.map((document, index) => ({
    key: document.$id,
    $id: document.$id,
    LastName: document.LastName,
    FirstName: document.FirstName,
    Company: document.Company,
    Address: document.address,
    isBonus: document.isBonus,
    Clients: document.clients,
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
      title: "Infos",
      dataIndex: "infos",
      key: "infos",
      render: () => (
        <Button className="infoBtn" type="primary" onClick={showModal}>
          Infos
        </Button>
      ),
    },
    {
      title: "Last Name",
      dataIndex: "LastName",
      key: "LastName",
      width: "30%",
      ...getColumnSearchProps("LastName"),
    },
    {
      title: "First Name",
      dataIndex: "FirstName",
      key: "FirstName",
      width: "30%",
      ...getColumnSearchProps("FirstName"),
    },
    {
      title: "Company",
      dataIndex: "Company",
      key: "Company",
      ...getColumnSearchProps("Company"),
      sorter: (a, b) => a.Company.length - b.Company.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      dataIndex: "isBonus",
      key: "isBonus",
      width: "30%",
      render: (isBonus) => (
        <span style={{ color: isBonus ? "green" : "red" }}>
          {isBonus ? "Bonus" : "No Bonus"}
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (selectedUser) {
      // Filter all clients to get selected user's clients
      console.log(selectedUser.Clients);
      const filteredClients = allClients.filter((client) =>
        selectedUser.Clients.includes(client.$id)
      );
      setSelectedUserClients(filteredClients);
    }
  }, [selectedUser, allClients]);

  const handleAddClient = async () => {
    const userData = await getUserData(selectedUser.$id);
    const updatedClientsData = await userData.clients;

    console.log("updatedClientsData azeazezaeazeazeza", updatedClientsData);
    const filteredClients = allClients.filter((client) =>
      updatedClientsData.includes(client.$id)
    );
    setSelectedUserClients(filteredClients);
  };

  return (
    <div className="adminContainer flex justify-around flex-col lg:flex-row items-center lg:items-start m">
      <div className="userInfos w-full md:w-4/5 bg-slate-100 main-component h-full overflow-scroll md:overflow-auto">
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
        <Modal
          title="Informations"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <br />
          <p>
            {selectedUser.LastName} {selectedUser.FirstName}
          </p>
          <br />
          <p> {selectedUser.Address}.</p>
          <br />
          <p>{selectedUser.isBonus ? "Bonus" : "No Bonus"}</p>
          <br />
          <h1 className="clientsList">
            {selectedUser.FirstName}'s current clients
          </h1>
          <ClientsList
            selectedUserClients={selectedUserClients}
            selectedUserID={selectedUser.$id}
          />
          <br />
          <br />
          <AddClients
            clients={allClients}
            user={selectedUser}
            onAddClient={handleAddClient}
          />
        </Modal>
      </div>
      <div className="calendarAdminSide flex w-full sm:w-4/5 h-full my-auto">
        {selectedUser ? (
          <Calendar
            key={remountCalendar ? Date.now() : selectedUser.$id}
            user={selectedUser}
          />
        ) : (
          <p className="text-xl mx-auto my-2">
            Select an employee to display their calendar
          </p>
        )}
      </div>
    </div>
  );
};

export default UserSort;
