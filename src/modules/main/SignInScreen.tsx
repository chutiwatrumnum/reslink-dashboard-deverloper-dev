import { Button, Col, Form, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import LOGO from "../../assets/images/SignInLogo.png";
import { getAuthCode } from "../../utils/googleAuth";

const { Title } = Typography;

const SignInScreen = () => {
  const [authCode, setAuthCode] = useState<string>("");





  // Temporary bypass function for development
  const handleBypassLogin = async () => {
    try {
      window.location.href = "/dashboard/userManagement";
    } catch (error) {
      console.error("Bypass login error:", error);
    }
  };

  const handleGetAccessToken = async () => {
    if (authCode) {

    }
  };


  useEffect(() => {
    // ดึง Auth Code เมื่อมีการ Redirect
    const code = getAuthCode();
    if (code && code !== authCode) {
      setAuthCode(code);
    }
    handleGetAccessToken();
  }, [authCode]);

  return (
    <div className="modern-signin-container">
      <Row className="modern-signin-row">
        {/* Left Side - Form */}
        <Col xs={24}  className="signin-form-section flex justify-center items-center h-screen">
          <div className="modern-form-container h-full flex flex-col items-center justify-center px-10">
            {/* Logo and Title */}
            <div className="signin-header">
              <div className="logo-container flex justify-center">
                <img src={LOGO} alt="Logo Brand"  className="w-[300px] " />
              </div>

              <Title level={2} className="signin-title text-center">
                Login
              </Title>
            </div>

            <Form
              name="signin"
              className="modern-signin-form flex flex-col items-center"
              layout="vertical"
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              {/* Development Bypass Button */}
                <div className="responsive-button-container">
                  <Button
                    onClick={handleBypassLogin}
                    block
                    className="bypass-login-btn"
                    style={{ 
                      marginTop: '10px', 
                      backgroundColor: '#52c41a', 
                      color: 'white',
                      borderColor: '#52c41a',
                      fontSize: 'clamp(12px, 2.5vw, 16px)',
                      height: 'auto',
                      minHeight: '40px',
                      padding: '8px 12px',
                    }}
                    title="Bypass Login (Development)"
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                      }}
                    >
                      <span className="hidden sm:inline">🔓 Bypass Login (Development)</span>
                      <span className="sm:hidden">🔓 Bypass Login</span>
                    </span>
                  </Button>
                </div>
            </Form>
          </div>
        </Col>

      </Row>
    </div>
  );
};

export default SignInScreen;
