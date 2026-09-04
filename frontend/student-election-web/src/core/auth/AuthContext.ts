import { createContext } from 'react'
import type { CurrentUser, LoginRequest } from './auth.types'
import type { UserRole } from '@core/types/enums'

export interface AuthContextValue {
  accessToken: string | null
  currentUser: CurrentUser | null
  isAuthenticated: boolean
  role: UserRole | null
  login(credentials: LoginRequest): Promise<CurrentUser>
  logout(): void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
