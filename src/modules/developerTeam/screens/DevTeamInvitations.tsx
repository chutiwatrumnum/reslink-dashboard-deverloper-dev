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
  Flex,
  Tabs,
} from "antd";
import dayjs from "dayjs";
import TeamInvitationCreateModal from "../components/TeamInvitationCreateModal";
import TeamInvitationEditModal from "../components/TeamInvitationEditModal";
// Data
import { developerTeamData } from "../mockup-data/TableData";
// Icons
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// Types
import type { TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { developerTeamType } from "../../../stores/interfaces/DeveloperTeam";

const DevTeamInvitations = () => {
  const mockupData: developerTeamType[] = developerTeamData;
  const [isVerified, setIsVerified] = useState(false);
  const items: TabsProps["items"] = [
    { key: "unverified", label: "Waiting for Verification" },
    { key: "verified", label: "Verified" },
  ];
  const onTabsChange = (key: string) => {
    // console.log(key);
    if (key === "verified") {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  };

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

  const [onCreateModalOpen, setOnCreateModalOpen] = useState(false);
  const [onEditModalOpen, setOnEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // 🪧➕ Add invitation modal
  const onCreate = () => {
    setOnCreateModalOpen(true);
  };
  const onCreateOk = () => {
    setOnCreateModalOpen(false);
  };
  const onCreateCancel = () => {
    setOnCreateModalOpen(false);
  };

  // 🪧🖋️ Edit Unverified modal
  const onEdit = () => {
    setOnEditModalOpen(true);
  };
  const onEditOk = () => {
    setOnEditModalOpen(false);
  };
  const onEditCancel = () => {
    setOnEditModalOpen(false);
  };

  const onRefresh: VoidFunction = () => {
    setRefresh(!refresh);
  };

  // 🗑️ Delete
  const showDeleteUnverifiedConfirm = ({ currentTarget }: any) => {
    ConfirmModal({
      title: "Delete confirmation?",
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
  // Resend Verify Button
  const onResendVerify = () => {
    console.log("Resend verify");
  };

  const defaultColumns: ColumnsType<developerTeamType> = [
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
  ];

  const unverifiedColumns: ColumnsType<developerTeamType> = [
    ...defaultColumns,
    {
      title: "Invite expired",
      dataIndex: "invitedExpired",
      key: "invitedExpired",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.invitedExpired !== "-"
              ? dayjs(record.invitedExpired).format("DD/MM/YYYY HH:mm")
              : "-"}
          </div>
        );
      },
    },
    {
      title: "Verification",
      align: "center",
      render: () => {
        return (
          <Button
            size="middle"
            onClick={onResendVerify}
            type="text"
            style={{ border: "solid", borderColor: "#4a95ff" }}
          >
            Resend verify
          </Button>
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

  const verifiedColumns: ColumnsType<developerTeamType> = [
    ...defaultColumns,
    {
      title: "Verified date & time",
      dataIndex: "verifiedDate",
      key: "verifiedDate",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.verifiedDate !== "-"
              ? dayjs(record.verifiedDate).format("DD/MM/YYYY HH:mm")
              : "-"}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Header title="Developer team invitations" />
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
        <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onCreate}
            type="primary"
            size="middle"
            style={{ width: 200 }}
          >
            New Invitations
          </Button>
        </Col>
      </Row>
      <Flex align="center" justify="space-between" style={{ marginTop: 8 }}>
        <Tabs
          defaultActiveKey="unverified"
          items={items}
          onChange={onTabsChange}
        />
      </Flex>
      <Row>
        <Col span={24}>
          <Table
            columns={isVerified ? verifiedColumns : unverifiedColumns}
            dataSource={mockupData}
          />
        </Col>
      </Row>
      <TeamInvitationCreateModal
        isCreateModalOpen={onCreateModalOpen}
        onCancel={onCreateCancel}
        onOk={onCreateOk}
        onRefresh={onRefresh}
      />
      <TeamInvitationEditModal
        isEditModalOpen={onEditModalOpen}
        onCancel={onEditCancel}
        onOk={onEditOk}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default DevTeamInvitations;
