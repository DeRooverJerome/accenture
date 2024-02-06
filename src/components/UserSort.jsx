import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { listDocuments } from "../lib/appwrite";

const UserSort = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [documents, setDocuments] = useState([]);

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
    LastName: document.LastName,
    FirstName: document.FirstName,
    Company: document.Company,
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
  const columns = [
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
      width: "20%",
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
  ];

  //   return <Table columns={columns} dataSource={arrayUser} />;

  const [selectedUser, setSelectedUser] = useState("");

  return (
    <Table
      rowClassName={(record, rowIndex) =>
        rowIndex === selectedUser ? "selected-row" : ""
      }
      dataSource={arrayUser}
      columns={columns}
      onRow={( record, rowIndex) => {
        return {
          onClick: (e) => {
            setSelectedUser(rowIndex);
            console.log("selected user", record, rowIndex);
          },
        };
      }}
    />
  );
};
export default UserSort;
