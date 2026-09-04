import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { AUTH_SESSION_EXPIRED_EVENT } from '@core/constants/auth.constants'
import { authService } from '@features/auth/services/AuthService'
import { authSessionStorage } from './auth-session.storage'
import { AuthContext, type AuthContextValue } from './AuthContext'
import type { AuthSession, LoginRequest } from './auth.types'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    authSessionStorage.getSession(),
  )

  const logout = useCallback(() => {
    authSessionStorage.clearSession()
    setSession(null)
  }, [])

  useEffect(() => {
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, logout)
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, logout)
  }, [logout])

  const login = useCallback(async (credentials: LoginRequest) => {
    const { accessToken, ...currentUser } = await authService.login(credentials)
    const nextSession = { accessToken, currentUser }
    authSessionStorage.setSession(nextSession)
    setSession(nextSession)
    return currentUser
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.accessToken ?? null,
      currentUser: session?.currentUser ?? null,
      isAuthenticated: session !== null,
      role: session?.currentUser.role ?? null,
      login,
      logout,
    }),
    [login, logout, session],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
