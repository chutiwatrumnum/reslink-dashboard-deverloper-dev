import { createModel } from "@rematch/core";
import { message } from "antd";
import {
  UserType,
  LoginPayloadType,
  ResetPasswordPayloadType,
} from "../interfaces/User";
import { RootModel } from "./index";
import { encryptStorage } from "../../utils/encryptStorage";
import FailedModal from "../../components/common/FailedModal";
import { callSuccessModal } from "../../components/common/Modal";
import axios from "axios";

export const userAuth = createModel<RootModel>()({
  state: {
    userId: null,
    userFirstName: "Den",
    userLastName: "Tao",
    isAuth: false,
    userToken: null,
    isSignUpModalOpen: false,
    isConfirmDetailModalOpen: false,
  } as UserType,
  reducers: {
    updateUserIdState: (state, payload) => ({
      ...state,
      userId: payload,
    }),
    updateUserFirstNameState: (state, payload) => ({
      ...state,
      userFirstName: payload,
    }),
    updateUserLastNameState: (state, payload) => ({
      ...state,
      userLastName: payload,
    }),
    updateAuthState: (state, payload) => ({
      ...state,
      isAuth: payload,
    }),
    updateIsSignUpModalOpenState: (state, payload) => ({
      ...state,
      isSignUpModalOpen: payload,
    }),
    updateIsConfirmDetailModalOpenState: (state, payload) => ({
      ...state,
      isConfirmDetailModalOpen: payload,
    }),
  },
  effects: (dispatch) => ({
    // แก้ไข loginEffects ให้ใช้ API จริงเท่านั้น
    async loginEffects(
      payload: LoginPayloadType | { username: string; password: string }
    ) {
      try {
        // ปรับ payload ให้เป็นรูปแบบเดียวกัน
        const loginData =
          "username" in payload
            ? { username: payload.username, password: payload.password }
            : { username: payload.username, password: payload.password };

        console.log("🔑 Attempting real API login with:", {
          username: loginData.username,
        });

        // เรียก API login จริงเท่านั้น
        const userToken = await axios.post("/auth/developer/login", loginData);

        if (userToken.status >= 400) {
          FailedModal(userToken.data.message || "Login failed");
          return false;
        }

        console.log("✅ Login API successful");

        // เก็บ tokens จริง
        encryptStorage.setItem("access_token", userToken.data.access_token);
        if (userToken.data.refreshToken) {
          encryptStorage.setItem("refreshToken", userToken.data.refreshToken);
        } else if (userToken.data.refresh_token) {
          encryptStorage.setItem("refreshToken", userToken.data.refresh_token);
        }

        // เรียก API เพื่อเช็ค developer ID
        try {
          const developerData = await axios.get("/my-developer");
          if (
            developerData.data &&
            developerData.data.data &&
            developerData.data.data.myDeveloperId
          ) {
            // เก็บ developer information จริง
            encryptStorage.setItem(
              "myDeveloperId",
              developerData.data.data.myDeveloperId
            );
            encryptStorage.setItem(
              "developerName",
              developerData.data.data.DeveloperName
            );
            encryptStorage.setItem(
              "roleName",
              developerData.data.data.roleName
            );

            console.log("✅ Developer data loaded:", {
              id: developerData.data.data.myDeveloperId,
              name: developerData.data.data.DeveloperName,
              role: developerData.data.data.roleName,
            });
          } else {
            throw new Error("Developer data not found in response");
          }
        } catch (error) {
          console.error(
            "❌ Developer data API failed:",
            error?.response?.status
          );
          throw new Error("Failed to load developer data");
        }

        // เรียก profile API (ถ้ามี)
        try {
          const userData = await axios.get("/auth/profile");
          if (userData.data && userData.data.result) {
            encryptStorage.setItem("userData", userData.data.result);
          } else if (userData.data) {
            encryptStorage.setItem("userData", userData.data);
          }
          console.log("✅ Profile data loaded");
        } catch (error) {
          console.log(
            "ℹ️ Profile data not available:",
            error?.response?.status
          );
          // Profile data ไม่จำเป็น ไม่ให้ fail
        }

        // อัพเดท auth state
        dispatch.userAuth.updateAuthState(true);

        // แสดง success message
        callSuccessModal("Login successful!");

        return true;
      } catch (error) {
        console.error("❌ Login failed:", error);

        let errorMessage = "Login failed. Please check your credentials.";

        if (error?.response?.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (error?.response?.status === 400) {
          errorMessage = error?.response?.data?.message || "Invalid request.";
        } else if (error?.response?.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error?.message) {
          errorMessage = error.message;
        }

        FailedModal(errorMessage);
        return false;
      }
    },

    async recoveryByEmail(payload: { email: string }) {
      try {
        const result = await axios.post("/users/forgot-password", payload);
        if (result.status >= 400) {
          console.error(result.data.message);
          FailedModal(result.data.message);
          return;
        }
        return true;
      } catch (error) {
        console.error("ERROR", error);
      }
    },

    async resetPassword(payload: ResetPasswordPayloadType) {
      try {
        const result = await axios.put("/users/forgot-password", payload);
        if (result.status >= 400) {
          message.error(result.data.message);
          return false;
        }
        return true;
      } catch (error) {
        console.error("ERROR", error);
      }
    },

    async refreshTokenNew() {
      try {
        const refreshToken = await encryptStorage.getItem("refreshToken");

        if (!refreshToken || refreshToken === "undefined") {
          console.error("No refresh token available");
          throw "refresh token not found";
        }

        console.log("🔄 Attempting to refresh token...");
        const res = await axios.post("/auth/developer/refresh-token", {
          refreshToken: refreshToken,
        });

        if (res.status >= 400) {
          console.error("Refresh token API error:", res.data.message);
          throw "refresh token expired";
        }

        if (!res.data.hasOwnProperty("access_token")) {
          console.error("No access_token in response:", res.data);
          throw "access_token not found";
        }

        console.log("✅ Token refreshed successfully");
        encryptStorage.setItem("access_token", res.data.access_token);

        // อัพเดท refresh token ใหม่ถ้ามี
        if (res.data.refresh_token) {
          encryptStorage.setItem("refreshToken", res.data.refresh_token);
        }

        dispatch.userAuth.updateAuthState(true);
        return true;
      } catch (error) {
        console.error("Refresh token failed:", error);
        // Logout when refresh token fails
        dispatch.userAuth.onLogout();
        return false;
      }
    },

    async onLogout() {
      try {
        // ลบข้อมูลทั้งหมดออกจาก storage
        encryptStorage.removeItem("access_token");
        encryptStorage.removeItem("refreshToken");
        encryptStorage.removeItem("userData");

        // ลบข้อมูล developer ใหม่
        encryptStorage.removeItem("myDeveloperId");
        encryptStorage.removeItem("developerName");
        encryptStorage.removeItem("roleName");

        dispatch.userAuth.updateAuthState(false);
        return true;
      } catch (error) {
        // Force clear all data even if error occurs
        encryptStorage.removeItem("access_token");
        encryptStorage.removeItem("refreshToken");
        encryptStorage.removeItem("userData");
        encryptStorage.removeItem("myDeveloperId");
        encryptStorage.removeItem("developerName");
        encryptStorage.removeItem("roleName");

        dispatch.userAuth.updateAuthState(false);
        return false;
      }
    },
  }),
});
