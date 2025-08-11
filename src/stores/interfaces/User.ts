export interface UserType {
  userId: string | null;
  userFirstName: string;
  userLastName: string;
  isAuth: boolean;
  userToken: string | null;
  isSignUpModalOpen: boolean;
  isConfirmDetailModalOpen: boolean;
}

export interface LoginPayloadType {
  username: string;
  password: string;
}

export interface ResetPasswordPayloadType {
  email: string;
} 