import { useState } from "react";
// Components
import Header from "../../../components/templates/Header";
import ConfirmModal from "../../../components/common/ConfirmModal";
import {
  Row,
  Col,
  Table,
  DatePicker,
  DatePickerProps,
  Button,
  Input,
} from "antd";
import dayjs from "dayjs";
import DevTeamListEditModal from "../components/DevTeamListEditModal";
// Data
import { developerTeamData } from "../mockup-data/TableData";
// Icons
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// Types
import type { ColumnsType } from "antd/es/table";
import type { developerTeamType } from "../../../stores/interfaces/DeveloperTeam";

const DevTeamList = () => {
  const mockupData: developerTeamType[] = developerTeamData;
  // 📅 Date
  const { RangePicker } = DatePicker;
  const dateFormat = "MMMM,YYYY";
  const customFormat: DatePickerProps["format"] = (value) =>
    `Month : ${value.format(dateFormat)}`;

  const handleDate = async (e: any) => {
    // await
  };

  // 🔎 Search
  const { Search } = Input;
  const [search, setSearch] = useState("");

  const onSearch = async (value: string) => {
    setSearch(value);
    // await
  };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const onEdit = () => {
    setIsEditModalOpen(true);
  };
  const onEditCancel = () => {
    setIsEditModalOpen(false);
  };
  const onEditOk = () => {
    setIsEditModalOpen(false);
  };

  const onRefresh: VoidFunction = () => {
    setRefresh(!refresh);
  };

  // 🗑️ Delete
  const showDeleteUnverifiedConfirm = ({ currentTarget }: any) => {
    ConfirmModal({
      title: "Delete team list?",
      message: "Do you really want to delete this item?",
      okMessage: "Confirm",
      cancelMessage: "Cancel",
      onOk: async () => {
        onRefresh();
        console.log("Ok");
      },
      onCancel: () => {
        console.log("Cancel");
      },
    });
  };

  const columns: ColumnsType<developerTeamType> = [
    {
      title: "Name-Surname",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Phone number",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy",
      align: "center",
    },
    {
      title: "Created date & time",
      dataIndex: "createAt",
      key: "createdAt",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.createdAt !== "-"
              ? dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")
              : "-"}
          </div>
        );
      },
    },
    {
      title: "Action",
      align: "center",
      width: "10%",
      render: () => {
        return (
          <Row justify={"center"}>
            <Col>
              <Button
                type="text"
                onClick={onEdit}
                icon={
                  <EditOutlined style={{ fontSize: 20, color: "#403d38" }} />
                }
              />
            </Col>
            <Col>
              <Button
                onClick={showDeleteUnverifiedConfirm}
                type="text"
                icon={
                  <DeleteOutlined style={{ fontSize: 20, color: "#403d38" }} />
                }
              />
            </Col>
          </Row>
        );
      },
    },
  ];
  return (
    <>
      <Header title="Developer team list" />
      <Row gutter={10} style={{ marginTop: 24 }}>
        <Col span={6}>
          <RangePicker
            style={{ width: "100%" }}
            picker="month"
            format={customFormat}
          />
        </Col>
        <Col span={6}>
          <Search
            placeholder="Search by name"
            allowClear
            // onSearch={onSearch}
            className="searchBox"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Table columns={columns} dataSource={mockupData} />
        </Col>
      </Row>
      <DevTeamListEditModal
        isEditModalOpen={isEditModalOpen}
        onOk={onEditOk}
        onCancel={onEditCancel}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default DevTeamList;
