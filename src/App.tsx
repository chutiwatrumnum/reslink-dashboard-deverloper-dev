import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";

import "antd/dist/reset.css";
import "./App.css";
// layouts
import AuthorizedLayout from "./navigation/AuthorizedLayout";
import UnauthorizedLayout from "./navigation/UnauthorizedLayout";

// authorize routes
import ProjectManageView from "./modules/projectManagement/screens/projectManageView";

// old legacy routes
import ResidentInformationMain from "./modules/userManagement/screens/ResidentInformationMain";
import JuristicInvitation from "./modules/juristicManagement/screens/JuristicInvitation";
import JuristicManage from "./modules/juristicManagement/screens/JuristicManage";

// unauthorized routes
import SignInScreen from "./modules/main/SignInScreen";
import DevTeamInvitations from "./modules/developerTeam/screens/DevTeamInvitations";
import DevTeamList from "./modules/developerTeam/screens/DevTeamList";
import DevTeamPermission from "./modules/developerTeam/screens/DevTeamPermission";
import ProjectInvitation from "./modules/projectTeam/screens/ProjectInvitations";
import ProjectLists from "./modules/projectTeam/screens/ProjectLists";
// components

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* old legacy routes */}
        {/* unauthorized_route */}
        <Route path="auth" element={<UnauthorizedLayout />}>
          <Route index element={<SignInScreen />} />
        </Route>

        {/* authorized_route */}
        <Route path="dashboard" element={<AuthorizedLayout />}>
          <Route index element={<Navigate to="userManagement" replace />} />
          <Route path="userManagement" element={<ResidentInformationMain />} />

          {/* Project Team */}
          <Route path="projectInvitations" element={<ProjectInvitation />} />
          <Route path="projectList" element={<ProjectLists />} />
          {/* Juristic manage */}
          <Route path="juristicInvitation" element={<JuristicInvitation />} />
          <Route path="juristicManage" element={<JuristicManage />} />
          {/* old legacy routes */}

          {/* project manage */}
          <Route path="projectManage" element={<ProjectManageView />} />
          {/* Developer Team */}
          <Route
            path="developerTeamInvitations"
            element={<DevTeamInvitations />}
          />
          <Route path="developerTeamList" element={<DevTeamList />} />
          <Route
            path="developerTeamPermission"
            element={<DevTeamPermission />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
