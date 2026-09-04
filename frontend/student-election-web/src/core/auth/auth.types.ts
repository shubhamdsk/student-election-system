import type { UserRole } from '@core/types/enums'

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

export type CurrentUser = Omit<LoginResponse, 'accessToken'>

export interface AuthSession {
  accessToken: string
  currentUser: CurrentUser
}
