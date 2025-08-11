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

export interface JoinPayloadType {
  code: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  contact: string;
}