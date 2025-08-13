import { useState, useEffect } from "react";
// Components
import FormModal from "../../../components/common/FormModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import SmallButton from "../../../components/common/SmallButton";
import { Form, Input, Row, Col, Select } from "antd";
// CSS
import "../style/projectTeam.css";

type InvitationCreateModalType = {
  isCreateModalOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  onRefresh: () => void;
};

const InvitationCreateModal = ({
  isCreateModalOpen,
  onOk,
  onCancel,
  onRefresh,
}: InvitationCreateModalType) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const onModalClose = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = async (value: any) => {
    ConfirmModal({
      title: "Send invitation?",
      message: "Are you sure you want to send this invitation?",
      okMessage: "Confirm",
      cancelMessage: "Cancel",
      onOk: async () => {
        console.log(value);
        onOk();
        onRefresh();
      },
    });
  };

  useEffect(() => {
    setOpen(isCreateModalOpen);
  }, [isCreateModalOpen]);

  const ModalContent = () => {
    return (
      <Form
        form={form}
        name="projectInvitationCreateModal"
        initialValues={{ remember: true }}
        autoComplete="off"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={() => {
          console.log("FINISHED FAILED");
        }}
      >
        <Row gutter={20} style={{ marginTop: "10px" }}>
          <Col span={12}>
            <Form.Item
              label="First name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please input first name!",
                },
                {
                  max: 120,
                  message: "First name must be less than 120 characters",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Please input first name"
                maxLength={120}
                showCount
              />
            </Form.Item>
            <Form.Item
              label="Middle name"
              name="middleName"
              rules={[
                {
                  max: 120,
                  message: "First name must be less than 120 characters",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Please input middle name"
                maxLength={120}
                showCount
              />
            </Form.Item>
            <Form.Item
              label="Last name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Please input  surname!",
                },
                {
                  max: 120,
                  message: "Last name must be less than 120 characters",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Please input surname"
                maxLength={120}
                showCount
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tel"
              name="tel"
              rules={[
                {
                  required: true,
                  message: "Please input tel!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Please input tel"
                maxLength={10}
                showCount
              />
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select role!" }]}
            >
              <Select size="large" placeholder="Please select role">
                <Select.Option value="Super admin">Super admin</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Project"
              name="projectName"
              rules={[{ required: true, message: "Please select project!" }]}
            >
              <Select size="large" placeholder="Please select project">
                <Select.Option value="Project 1">Project 1</Select.Option>
                <Select.Option value="Project 2">Project 2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input email!",
                },
                {
                  max: 120,
                  message: "Email must be less than 120 characters",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Please input email"
                maxLength={120}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <SmallButton className="saveButton" message="Send" form={form} />
        </Form.Item>
      </Form>
    );
  };

  return (
    <>
      <FormModal
        isOpen={open}
        title="New invitations"
        content={<ModalContent />}
        onOk={onOk}
        onCancel={onModalClose}
        className="projectInvitationFormModal"
      />
    </>
  );
};

export default InvitationCreateModal;
