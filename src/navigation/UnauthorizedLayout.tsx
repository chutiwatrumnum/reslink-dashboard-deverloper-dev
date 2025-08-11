import { useEffect } from "react";
import { useOutlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../stores";
import { Col, Row } from "antd";
import { encryptStorage } from "../utils/encryptStorage";

// style
import "./styles/unAuthorizedLayout.css";

const UnauthorizedLayout = () => {
  const access_token = encryptStorage.getItem("access_token");
  const projectId = encryptStorage.getItem("projectId");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth } = useSelector((state: RootState) => state.userAuth);
  const outlet = useOutlet();
  const path = window.location.pathname;

  // ตรวจสอบว่าเป็นหน้า auth หรือไม่
  const isAuthPage = location.pathname === "/auth";

  useEffect(() => {
    console.log("🔍 UnauthorizedLayout check:", { 
      isAuth, 
      access_token, 
      projectId, 
      pathname: window.location.pathname,
      isAuthPage 
    });

    // Skip all processing if we're already authenticated and in dashboard
    if (isAuth && window.location.pathname.startsWith("/dashboard")) {
      console.log("🚫 User is authenticated and in dashboard - skipping all logic");
      return;
    }

    // Skip processing if we're already in dashboard routes (even if not fully authenticated yet)
    if (window.location.pathname.startsWith("/dashboard")) {
      console.log("🚫 Skipping UnauthorizedLayout logic - already in dashboard");
      return;
    }

    // Allow mock tokens
    const isMockToken = access_token === "mock_access_token";
    const isMockProjectId = projectId === "mock_project_id";

    if (isAuth && access_token && (projectId || isMockProjectId)) {
      console.log("✅ Authenticated, navigating to dashboard");
      navigate("/dashboard/test");
    } else if (!isAuth && !window.location.pathname.startsWith("/auth")) {
      console.log("❌ Not authenticated, redirecting to auth");
      window.location.pathname = "/auth";
    }
  }, [isAuth, access_token, projectId]);

  // สำหรับหน้า login ให้ใช้ layout แบบเต็มหน้าจอ
  if (isAuthPage) {
    return <>{outlet}</>;
  }

  // สำหรับหน้าอื่นๆ ใช้ layout เดิม
  return (
    <Row className="container">
      <Col className="contentContainer">{outlet}</Col>
    </Row>
  );
};

export default UnauthorizedLayout;
