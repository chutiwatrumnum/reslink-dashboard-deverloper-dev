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
          
          {/* Juristic manage */}
          <Route path="juristicInvitation" element={<JuristicInvitation />} />
          <Route path="juristicManage" element={<JuristicManage />} />
          {/* old legacy routes */}

          {/* project manage */}
          <Route path="projectManage" element={<ProjectManageView />} />

        </Route>
        
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
