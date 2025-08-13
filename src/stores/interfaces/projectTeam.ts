export interface conditionPage {
  perPage: number
  curPage: number
  search?: string
  startDate?: string
  endDate?: string
  sort?: string
  sortBy?: string
  unitId?: string
}

export interface projectTeamType {
    id: number;
    key:string;
    projectName: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    invitedExpired: string;
    createdAt?: string;
    createdBy?: string;
    verifiedDate?: string;
}
