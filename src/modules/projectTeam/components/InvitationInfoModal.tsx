import { useState, useEffect } from "react";
// Components
import { Form, Button, Modal } from "antd";
// CSS
import "../style/projectTeam.css";

import type { projectTeamType } from "../../../stores/interfaces/projectTeam";
import { ColumnsType } from "antd/es/table";

type InvitationInfoModal = {
  isInfoModalOpen: boolean;
  onCancel: () => void;
  onResendVerify: () => void;
};

const InvitationInfoModal = ({
  isInfoModalOpen,
  onCancel,
  onResendVerify,
}: InvitationInfoModal) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const onModalClose = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    setOpen(isInfoModalOpen);
  }, [isInfoModalOpen]);

  return (
    <Modal
      width={"30%"}
      open={open}
      title="Information"
      onCancel={onModalClose}
      footer={false}
      centered={true}
    >
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4 style={{ fontWeight: "600" }}>Created date & time</h4>
            <p>10/07/2025 15:00</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4 style={{ fontWeight: "600" }}>Phone number</h4>
            <p>0899999999</p>
          </div>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4 style={{ fontWeight: "600" }}>Created by</h4>
            <p>Project Superadmin</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4 style={{ fontWeight: "600" }}>Verification</h4>
            <Button
              size="middle"
              onClick={onResendVerify}
              type="text"
              style={{
                width: 140,
                borderColor: "var(--secondary-color)",
                borderStyle: "solid",
                color: "var(--primary-color)",
              }}
            >
              Resend Verify
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvitationInfoModal;
