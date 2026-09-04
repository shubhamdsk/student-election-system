import type { ApprovalStatus, UserRole } from '@core/types/enums'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  userId: string
  email: string
  role: UserRole
}

interface BaseCurrentUser {
  userId: string
  email: string
}

export interface AdminCurrentUser extends BaseCurrentUser {
  role: 'Admin'
}

export interface StudentCurrentUser extends BaseCurrentUser {
  role: 'Student'
  approvalStatus: ApprovalStatus
}

export type CurrentUser = AdminCurrentUser | StudentCurrentUser

export interface AuthSession {
  accessToken: string
  currentUser: CurrentUser
}

export interface AuthContextValue {
  accessToken: string | null
  currentUser: CurrentUser | null
  isAuthenticated: boolean
  role: UserRole | null
  login(credentials: LoginRequest): Promise<CurrentUser>
  refreshStudentApproval(): Promise<ApprovalStatus>
  logout(): void
}
