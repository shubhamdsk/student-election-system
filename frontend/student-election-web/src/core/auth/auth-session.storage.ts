import { AUTH_SESSION_STORAGE_KEY } from '@core/constants/auth.constants'
import { APPROVAL_STATUSES, USER_ROLES } from '@core/types/enums'
import type { AuthSession } from './auth.types'

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false

  const session = value as Record<string, unknown>
  const user = session.currentUser
  if (!user || typeof user !== 'object') return false

  const currentUser = user as Record<string, unknown>
  const hasValidBaseUser = (
    typeof session.accessToken === 'string' &&
    typeof currentUser.userId === 'string' &&
    typeof currentUser.email === 'string' &&
    typeof currentUser.role === 'string' &&
    USER_ROLES.some((role) => role === currentUser.role)
  )

  if (!hasValidBaseUser) return false
  if (currentUser.role === 'Admin') return true

  return (
    typeof currentUser.approvalStatus === 'string' &&
    APPROVAL_STATUSES.some((status) => status === currentUser.approvalStatus)
  )
}

export const authSessionStorage = {
  getSession(): AuthSession | null {
    const storedSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
    if (!storedSession) return null

    try {
      const parsedSession: unknown = JSON.parse(storedSession)
      if (isAuthSession(parsedSession)) return parsedSession
    } catch {
      // Invalid browser data is removed below.
    }

    this.clearSession()
    return null
  },

  setSession(session: AuthSession): void {
    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
  },

  clearSession(): void {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
  },

  getToken(): string | null {
    return this.getSession()?.accessToken ?? null
  },
}
