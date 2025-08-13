import Header from "../../../components/templates/Header";
import ConfirmModal from "../../../components/common/ConfirmModal";
import {
  Row,
  Col,
  DatePicker,
  DatePickerProps,
  Input,
  Button,
  Table,
} from "antd";
import dayjs from "dayjs";
// Icons
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { ProjectTeamMockData } from "../mockup-data/TableData";

import type { ColumnsType } from "antd/es/table";
import type { projectTeamType } from "../../../stores/interfaces/projectTeam";
import { useState } from "react";
import ProjectListEditModal from "../components/ProjectListEditModal";

const ProjectLists = () => {
  const { RangePicker } = DatePicker;
  const dateFormat = "MMMM,YYYY";
  const customFormat: DatePickerProps["format"] = (value) =>
    `Month : ${value.format(dateFormat)}`;
  const { Search } = Input;

  const scroll: { x?: number | string } = {
    x: 1500, // ปรับค่าตามความกว้างรวมของคอลัมน์
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const onEdit = () => {
    setIsEditModalOpen(true);
  };
  const onEditOk = () => {
    setIsEditModalOpen(false);
  };
  const onEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const onRefresh: VoidFunction = () => {
    setRefresh(!refresh);
  };

  const showDeleteConfirm = ({ currentTarget }: any) => {
    ConfirmModal({
      title: "Delete project list?",
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

  const mockupData: projectTeamType[] = ProjectTeamMockData;

  const columns: ColumnsType<projectTeamType> = [
    {
      title: "Project Name",
      key: "projectName",
      dataIndex: "projectName",
      align: "center",
      width: "8%",
    },
    {
      title: "Name-Surname",
      key: "name",
      dataIndex: "name",
      align: "center",
      width: "12%",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      align: "center",
      width: "8%",
    },
    {
      title: "email",
      key: "email",
      dataIndex: "email",
      align: "center",
      width: "10%",
    },
    {
      title: "Phone number",
      key: "phone",
      dataIndex: "phone",
      align: "center",
      width: "8%",
    },
    {
      title: "Created date & time",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "center",
      width: "9%",
      render: (_, record) => {
        return (
          <div>
            {record.createdAt !== "-"
              ? dayjs(record.createdAt).format(`DD/MM/YYYY, HH:mm`)
              : "-"}
          </div>
        );
      },
    },
    {
      title: "Created by",
      key: "createdBy",
      dataIndex: "createdBy",
      align: "center",
      width: "8%",
    },
    {
      title: "Action",
      align: "center",
      fixed: "right",
      width: "7%",
      render: () => {
        return (
          <Row justify={"center"}>
            <Col>
              <Button
                onClick={onEdit}
                type="text"
                icon={
                  <EditOutlined style={{ fontSize: 20, color: "#403d38" }} />
                }
              />
            </Col>
            <Col>
              <Button
                onClick={showDeleteConfirm}
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
      <Header title="Project list" />
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
          <Table dataSource={mockupData} columns={columns} scroll={scroll} />
        </Col>
      </Row>
      <ProjectListEditModal
        isProjectListModalOpen={isEditModalOpen}
        onOk={onEditOk}
        onCancel={onEditCancel}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default ProjectLists;
