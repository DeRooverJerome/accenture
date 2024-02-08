// import React, { useEffect, useRef, useState } from "react";
// import { SearchOutlined } from "@ant-design/icons";
// import { Button, Input, Space, Table, Modal } from "antd";
// import Highlighter from "react-highlight-words";
// import { listDocuments } from "../lib/appwrite";
// import Calendar from "../components/calendar";
// import BonusChecker from "./bonusChecker";

// const UserSort = () => {
//   const [searchText, setSearchText] = useState("");
//   const [searchedColumn, setSearchedColumn] = useState("");
//   const [documents, setDocuments] = useState([]);

//   useEffect(() => {
//     listDocuments()
//       .then((response) => {
//         setDocuments(response.documents);
//         console.log(response.documents);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, []);

//   const arrayUser = documents.map((document, index) => ({
//     key: index,
//     $id: document.$id,
//     LastName: document.LastName,
//     FirstName: document.FirstName,
//     Company: document.Company,
//     bonus: <BonusChecker bonusValue={document.Bonus} />,
//   }));

//   const searchInput = useRef(null);
//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };
//   const handleReset = (clearFilters) => {
//     clearFilters();
//     setSearchText("");
//   };
//   const getColumnSearchProps = (dataIndex) => ({
//     filterDropdown: ({
//       setSelectedKeys,
//       selectedKeys,
//       confirm,
//       clearFilters,
//       close,
//     }) => (
//       <div
//         style={{
//           padding: 8,
//         }}
//         onKeyDown={(e) => e.stopPropagation()}
//       >
//         <Input
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={(e) =>
//             setSelectedKeys(e.target.value ? [e.target.value] : [])
//           }
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{
//             marginBottom: 8,
//             display: "block",
//           }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{
//               width: 90,
//             }}
//           >
//             Search
//           </Button>
//           <Button
//             onClick={() => clearFilters && handleReset(clearFilters)}
//             size="small"
//             style={{
//               width: 90,
//             }}
//           >
//             Reset
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               confirm({
//                 closeDropdown: false,
//               });
//               setSearchText(selectedKeys[0]);
//               setSearchedColumn(dataIndex);
//             }}
//           >
//             Filter
//           </Button>
//           <Button
//             type="link"
//             size="small"
//             onClick={() => {
//               close();
//             }}
//           >
//             close
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => (
//       <SearchOutlined
//         style={{
//           color: filtered ? "#1677ff" : undefined,
//         }}
//       />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//     onFilterDropdownOpenChange: (visible) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: (text) =>
//       searchedColumn === dataIndex ? (
//         <Highlighter
//           highlightStyle={{
//             backgroundColor: "#ffc069",
//             padding: 0,
//           }}
//           searchWords={[searchText]}
//           autoEscape
//           textToHighlight={text ? text.toString() : ""}
//         />
//       ) : (
//         text
//       ),
//   });

//   const columns = [
//     {
//       title: "Infos",
//       dataIndex: "infos",
//       key: "infos",
//     },
//     {
//       title: "Last Name",
//       dataIndex: "LastName",
//       key: "LastName",
//       width: "30%",
//       ...getColumnSearchProps("LastName"),
//     },
//     {
//       title: "First Name",
//       dataIndex: "FirstName",
//       key: "FirstName",
//       width: "30%",
//       ...getColumnSearchProps("FirstName"),
//     },
//     {
//       title: "Company",
//       dataIndex: "Company",
//       key: "Company",
//       ...getColumnSearchProps("Company"),
//       sorter: (a, b) => a.Company.length - b.Company.length,
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Status",
//       dataIndex: "isBonus",
//       key: "isBonus",
//     },
//   ];

//   const [selectedUser, setSelectedUser] = useState("");

//   return (
//     <div className="adminContainer">
//       <div className="userInfos">
//         <Table
//           rowClassName={(record, rowIndex) =>
//             rowIndex === selectedUser ? "selected-row" : ""
//           }
//           dataSource={arrayUser}
//           columns={columns}
//           onRow={(record, rowIndex) => {
//             return {
//               onClick: (e) => {
//                 setSelectedUser(record);
//                 console.log(record);
//               },
//             };
//           }}
//         />
//       </div>
//       <div className="calendarAdminSide">
//         {selectedUser && (
//           <Calendar key={selectedUser.$id} user={selectedUser} />
//         )}
//       </div>
//     </div>
//   );
// };
// export default UserSort;

import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Modal } from "antd";
import Highlighter from "react-highlight-words";
import { listDocuments } from "../lib/appwrite";
import Calendar from "../components/calendar";
import BonusChecker from "./bonusChecker";

const UserSort = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    listDocuments()
      .then((response) => {
        setDocuments(response.documents);
        console.log(response.documents);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const arrayUser = documents.map((document, index) => ({
    key: index,
    $id: document.$id,
    LastName: document.LastName,
    FirstName: document.FirstName,
    Company: document.Company,
    Address: document.address,
    Bonus: document.isBonus,
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
        <Button type="primary" onClick={showModal}>
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
      render: (isBonus) =>(
        <h5>{isBonus ? 'YES' : 'NO'}</h5>
      ),
    },
  ];
  return (
    <div className="adminContainer">
      <div className="userInfos">
        <Table
          rowClassName={(record, rowIndex) =>
            rowIndex === selectedUser ? "selected-row" : ""
          }
          dataSource={arrayUser}
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (e) => {
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
          <p>
            {selectedUser.LastName} {selectedUser.FirstName} -{" "}
            {selectedUser.Address}
          </p>
        </Modal>
      </div>
      <div className="calendarAdminSide">
        {selectedUser && (
          <Calendar key={selectedUser.$id} user={selectedUser} />
        )}
      </div>
    </div>
  );
};

export default UserSort;
