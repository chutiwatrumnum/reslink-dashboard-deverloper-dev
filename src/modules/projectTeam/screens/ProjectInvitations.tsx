import { useState } from "react";
// Mock data
import { ProjectTeamMockData } from "../mockup-data/TableData";
// Components
import Header from "../../../components/templates/Header";
import ConfirmModal from "../../../components/common/ConfirmModal";
import InvitationCreateModal from "../components/InvitationCreateModal";
import InvitationUnverifiedEditModal from "../components/InvitationUnverifiedEditModal";
import InvitationInfoModal from "../components/InvitationInfoModal";

import {
  Table,
  Row,
  Col,
  DatePicker,
  DatePickerProps,
  Button,
  Input,
  Flex,
  Tabs,
} from "antd";
import { TabsProps } from "antd";
import dayjs from "dayjs";
// Icons
import {
  EditOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
// Types
import type { ColumnsType } from "antd/es/table";
import type {
  projectTeamType,
  conditionPage,
} from "../../../stores/interfaces/projectTeam";

const ProjectInvitation = () => {
  const [dataEdit, setDataEdit] = useState<projectTeamType | null>(null);
  const [rerender, setRerender] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditUnverifiedModalOpen, setIsEditUnverifiedModalOpen] =
    useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState(false);

  // 🪧➕ Add invitation modal
  const onCreate = () => {
    setIsCreateModalOpen(true);
  };
  const onCreateOk = () => {
    setIsCreateModalOpen(false);
  };
  const onCreateCancel = () => {
    setIsCreateModalOpen(false);
  };

  // 🪧🖋️ Edit Unverified modal
  const onEditUnverified = async (data: projectTeamType) => {
    setDataEdit(data);
    setIsEditUnverifiedModalOpen(true);
  };
  const onEditUnverifiedOk = () => {
    setIsEditUnverifiedModalOpen(false);
  };
  const onEditUnverifiedCancel = () => {
    setIsEditUnverifiedModalOpen(false);
  };

  // 🪧📋 Info Unverified modal
  const onInfoUnverified = () => {
    setIsInfoModalOpen(true);
  };
  const onInfoUnverifiedCancel = () => {
    setIsInfoModalOpen(false);
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
      },
      onCancel: () => {
        console.log("Cancel");
      },
    });
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

  const onChangeUnit = async (value: string) => {
    // await
  };

  // 🔲 resend verify
  const handleResendVerify = () => {
    console.log("Resend Verify");
  };

  // 📑 Tabs
  const items: TabsProps["items"] = [
    {
      key: "unverified",
      label: "Waiting for Verification",
    },
    {
      key: "verified",
      label: "Verified",
    },
  ];
  const onTabsChange = (key: string) => {
    // console.log(key);
    if (key === "verified") {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  };

  const mockupData: projectTeamType[] = ProjectTeamMockData;

  const defaultColumns: ColumnsType<projectTeamType> = [
    {
      title: "Project Name",
      key: "projectName",
      dataIndex: "projectName",
      align: "center",
    },
    {
      title: "Name-Surname",
      key: "name",
      dataIndex: "name",
      align: "center",
      //   render: (_, record) => {
      //     return (
      //       <div>
      //         {record?.activateBy?.givenName
      //           ? `${record?.activateBy?.givenName} ${record?.activateBy?.familyName}`
      //           : "-"}
      //       </div>
      //     );
      //   },
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      align: "center",
      //   render: (_, record) => {
      //     return <div>{`${record?.role?.name}`}</div>;
      //   },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
  ];

  const verifiedColumns: ColumnsType<projectTeamType> = [
    ...defaultColumns,
    {
      title: "Phone number",
      key: "phone",
      dataIndex: "phone",
      align: "center",
    },
    {
      title: "Created by",
      key: "createdBy",
      dataIndex: "createdBy",
      align: "center",
      width: "10%",
    },
    {
      title: "Created date & time",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "center",
      width: "12%",
      render: (_, record) => {
        return (
          <div>
            {record.createdAt !== "-"
              ? dayjs(record.createdAt).format(`DD/MM/YYYY HH:mm`)
              : "-"}
          </div>
        );
      },
    },
    {
      title: "Verified date & time",
      key: "verifiedDate",
      dataIndex: "verifiedDate",
      align: "center",
      width: "12%",
      render: (_, record) => {
        return (
          <div>
            {record.verifiedDate !== "-"
              ? dayjs(record.verifiedDate).format(`DD/MM/YYYY HH:mm`)
              : "-"}
          </div>
        );
      },
    },
  ];

  const unverifiedColumns: ColumnsType<projectTeamType> = [
    ...defaultColumns,
    {
      title: "Invited expired",
      key: "invitedExpired",
      dataIndex: "invitedExpired",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.invitedExpired !== "-"
              ? dayjs(record.invitedExpired).format(`DD/MM/YYYY HH:mm`)
              : "-"}
          </div>
        );
      },
    },
    {
      title: "Action",
      align: "center",
      fixed: "right",
      width: "14%",
      render: (_, record) => {
        return (
          <Row justify={"center"}>
            <Col>
              <Button
                type="text"
                onClick={onInfoUnverified}
                icon={
                  <InfoCircleOutlined
                    style={{ fontSize: 20, color: "#403d38" }}
                  />
                }
              />
            </Col>
            <Col>
              <Button
                type="text"
                onClick={async () => onEditUnverified(record)}
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
      <Header title="Project invitations" />
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
      {/* Add new invitation Modal */}
      <InvitationCreateModal
        isCreateModalOpen={isCreateModalOpen}
        onRefresh={onRefresh}
        onCancel={onCreateCancel}
        onOk={onCreateOk}
      />
      {/* Edit Unverified Modal */}
      <InvitationUnverifiedEditModal
        isEditUnverifiedModalOpen={isEditUnverifiedModalOpen}
        onRefresh={onRefresh}
        onCancel={onEditUnverifiedCancel}
        onOk={onEditUnverifiedOk}
      />
      {/* Info Unverified Modal */}
      <InvitationInfoModal
        isInfoModalOpen={isInfoModalOpen}
        onResendVerify={handleResendVerify}
        onCancel={onInfoUnverifiedCancel}
      />
    </>
  );
};

export default ProjectInvitation;
