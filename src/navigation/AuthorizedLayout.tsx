import { useEffect, useState, useLayoutEffect, useMemo } from "react";
import { useOutlet } from "react-router-dom";
import { Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../stores";
import { encryptStorage } from "../utils/encryptStorage";
import SideMenu from "../components/templates/SideMenu";
import "./styles/authorizedLayout.css";

const { Sider, Content } = Layout;

function AuthorizedLayout() {
  const { isAuth } = useSelector((state: RootState) => state.userAuth);
  const dispatch = useDispatch<Dispatch>();
  const access_token = encryptStorage.getItem("access_token");
  const projectId = encryptStorage.getItem("projectId");
  const outlet = useOutlet();

  console.log("🏗️ AuthorizedLayout render:", { 
    isAuth, 
    access_token, 
    projectId, 
    pathname: window.location.pathname,
    outlet: !!outlet
  });

  const [collapsed, setCollapsed] = useState(() => {
    // Default behavior: collapse on small screens, expand on large screens
    const isSmallScreen = window.innerWidth <= 1024;
    return isSmallScreen;
  });
  const [reload, setReload] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);      



  // ฟังก์ชันสำหรับ toggle การขยาย toast


  // Handle responsive behavior and menu collapse changes
  useEffect(() => {
    const handleResize = () => {
      const currentIsLargeScreen = window.innerWidth > 1024;
      setIsLargeScreen(currentIsLargeScreen);
      
      if (!currentIsLargeScreen) {
        // Always collapse on small screens (tablet/mobile)
        setCollapsed(true);
      } else {
        // On large screens (desktop), always expand by default
        setCollapsed(false);
        localStorage.setItem("sideMenuCollapsed", "false");
      }
    };

    const handleCollapsedChange = () => {
      // Only allow manual toggle on large screens
      if (isLargeScreen) {
        const newCollapsedState =
          localStorage.getItem("sideMenuCollapsed") === "true";
        setCollapsed(newCollapsedState);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("sideMenuCollapsed", handleCollapsedChange);
    
    // Call once on mount
    handleResize();
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("sideMenuCollapsed", handleCollapsedChange);
    };
  }, [isLargeScreen]);

  useLayoutEffect(() => {
    if (window.location.pathname !== "/auth") {
      (async () => {
        try {
          // Check Access token
          const access_token = await encryptStorage.getItem("access_token");
          const projectId = await encryptStorage.getItem("projectId");
          
          if (
            access_token === null ||
            access_token === undefined ||
            access_token === ""
          )
            throw "access_token not found";

          // Development mode: bypass token validation for mock tokens
          if (access_token === "mock_access_token" && projectId === "mock_project_id") {
            console.log("🔓 Development mode: bypassing all validation");
            dispatch.userAuth.updateAuthState(true);
            return true;
          }

          // Check Refresh token (only for real tokens)
          const resReToken = await dispatch.userAuth.refreshTokenNew();
          if (!resReToken) throw "access_token expired";

          // Token pass - skip fetchUnitOptions for mock tokens
          try {
            await dispatch.common.fetchUnitOptions();
          } catch (e) {
            console.warn("fetchUnitOptions failed, continuing anyway:", e);
          }
          dispatch.userAuth.updateAuthState(true);

          return true;
        } catch (e) {
          console.error("Auth error:", e);
          // Don't logout if it's a mock token
          const access_token = await encryptStorage.getItem("access_token");
          if (access_token !== "mock_access_token") {
            console.log("🚨 Logging out due to auth error");
            dispatch.userAuth.onLogout();
          } else {
            console.log("🔓 Mock token detected, skipping logout");
            // Still update auth state for mock tokens
            dispatch.userAuth.updateAuthState(true);
          }
          return false;
        }
      })();
    }
  }, [reload]); // Remove isAuth from dependencies to prevent loops


  // Calculate sider width based on screen size and collapsed state
  const siderWidth = useMemo(() => {
    if (!isLargeScreen) {
      // Small screens: always use collapsed width based on screen size
      return window.innerWidth <= 768 ? 70 : 80;
    }
    // Large screens: use collapsed state
    return collapsed ? 80 : 320;
  }, [isLargeScreen, collapsed]);
  
  console.log("📏 Layout dimensions:", { 
    isLargeScreen, 
    collapsed, 
    siderWidth, 
    windowWidth: window.innerWidth,
    savedCollapsedState: localStorage.getItem("sideMenuCollapsed")
  });

  return (
    <Layout>
      <Sider
        width={isLargeScreen ? 320 : siderWidth}
        collapsedWidth={siderWidth}
        collapsed={collapsed}
        trigger={null}
        className="sideContainer"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <SideMenu
          onMenuChange={() => {
            setReload(!reload);
          }}
        />
      </Sider>
      <div className="authorizeBG" style={{ left: siderWidth, transition: "all 0.3s" }} />
      <Layout style={{ marginLeft: siderWidth, transition: "all 0.3s" }}>
        <Content className="authorizeContentContainer">
          <div>{outlet}</div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AuthorizedLayout;
