import { createModel } from "@rematch/core";
import { UserType } from "../interfaces/User";
import { RootModel } from "./index";

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
    updateAuthState: (state, payload) => {
      console.log("🔄 Updating auth state:", { from: state.isAuth, to: payload });
      return {
        ...state,
        isAuth: payload,
      };
    },
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
    async refreshTokenNew() {
      try {
        // Mock implementation for development
        console.log("🔓 Mock refreshTokenNew - always returns true");
        return true;
      } catch (error) {
        console.error("refreshTokenNew error:", error);
        return false;
      }
    },

    async onLogout() {
      try {
        const { encryptStorage } = await import("../../utils/encryptStorage");
        encryptStorage.removeItem("projectId");
        encryptStorage.removeItem("access_token");
        encryptStorage.removeItem("refreshToken");
        dispatch.userAuth.updateAuthState(false);
        return true;
      } catch (error) {
        console.error("Logout error:", error);
        return false;
      }
    },
  }),
}); 