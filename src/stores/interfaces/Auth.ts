export interface AccessTokenType {
  code: string;
  redirectUrl: string;
}

export interface AuthState {
  isAuth: boolean;
  userId: string | null;
  userFirstName: string;
  userLastName: string;
  userToken: string | null;
  isSignUpModalOpen: boolean;
  isConfirmDetailModalOpen: boolean;
} 