// src/modules/main/SignInScreen.tsx
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import LOGO from "../../assets/images/SignInLogo.png";
import "./styles/signIn.css";
import { Link, useNavigate } from "react-router-dom";
import {
  callSuccessModal,
  callFailedModal,
} from "../../components/common/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../stores";

const { Title } = Typography;

interface LoginFormData {
  username: string;
  password: string;
  remember?: boolean;
}

const SignInScreen = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state: RootState) => state.userAuth);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard/userManagement", { replace: true });
    }
  }, [isAuth, navigate]);

  // Handle Email/Password Login
  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      console.log("🔑 Attempting login...");

      const result = await dispatch.userAuth.loginEffects({
        username: values.username,
        password: values.password,
      });

      if (result) {
        message.success("Login successful!");
        // Navigation will happen via useEffect when isAuth changes
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.message || "Login failed. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Form validation failed:", errorInfo);
    message.warning("Please check your input and try again.");
  };

  // Handle development bypass
  const handleBypassLogin = async () => {
    try {
      setLoading(true);

      // ใช้ fallback mode โดยตรง
      console.log("🔓 Development bypass login");

      const { encryptStorage } = await import("../../utils/encryptStorage");
      encryptStorage.setItem("access_token", "mock_access_token");
      encryptStorage.setItem("refreshToken", "mock_refresh_token");

      // เพิ่มข้อมูล developer
      encryptStorage.setItem("myDeveloperId", "mock_developer_id");
      encryptStorage.setItem("developerName", "Mock Developer");
      encryptStorage.setItem("roleName", "Developer Super Admin");

      dispatch.userAuth.updateAuthState(true);
      message.success("Bypass login successful!");
    } catch (error) {
      console.error("Bypass login error:", error);
      message.error("Bypass login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-signin-container">
      <Row className="modern-signin-row">
        {/* Left Side - Form */}
        <Col xs={24} lg={12} className="signin-form-section">
          <div className="modern-form-container">
            {/* Logo and Title */}
            <div className="signin-header">
              <div className="logo-container">
                <img src={LOGO} alt="Logo Brand" className="logo-brand" />
              </div>

              <Title level={2} className="signin-title">
                Welcome Back
              </Title>
              <p className="text-gray-500 mb-8">
                Sign in to your developer account
              </p>
            </div>

            {/* Email/Password Form */}
            <Form
              name="signin"
              form={form}
              className="modern-signin-form"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off">
              {/* Email Input */}
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}>
                <Input
                  size="large"
                  placeholder="Email"
                  className="modern-input"
                  autoComplete="username"
                />
              </Form.Item>

              {/* Password Input */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}>
                <Input.Password
                  size="large"
                  placeholder="Password"
                  className="modern-input"
                  autoComplete="current-password"
                />
              </Form.Item>

              {/* Options Row */}
              <div className="signin-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="keep-logged-checkbox">
                    Keep me logged in
                  </Checkbox>
                </Form.Item>

                <Link to="/recovery" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className="login-button"
                  loading={loading}>
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            {/* Development Bypass */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Button
                onClick={handleBypassLogin}
                block
                className="h-10 border-green-200 text-green-700 hover:border-green-400 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200">
                🔓 Bypass Login (Development)
              </Button>
            </div>
          </div>
        </Col>

        {/* Right Side - Illustration */}
        <Col xs={0} lg={12} className="modern-illustration-section">
          <div className="illustration-content">
            {/* Background Shapes */}
            <div className="bg-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
              <div className="shape shape-5"></div>
              <div className="shape shape-6"></div>
            </div>

            {/* Main Content */}
            <div className="main-text">
              <img src={LOGO} alt="Logo Brand" className="logo-brand" />
              <h1 className="text-4xl font-bold mb-4 text-white">
                Developer Portal
              </h1>
              <p className="text-xl text-blue-100 max-w-md mx-auto">
                Access your development tools and manage your projects
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SignInScreen;
