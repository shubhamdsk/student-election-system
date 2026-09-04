import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { AUTH_SESSION_EXPIRED_EVENT } from '@core/constants/auth.constants'
import { authService } from '@features/auth/services/AuthService'
import { studentService } from '@features/students/services/StudentService'
import { authSessionStorage } from './auth-session.storage'
import { AuthContext } from './AuthContext'
import type { AuthContextValue, AuthSession, LoginRequest } from './auth.types'

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
    const loginResponse = await authService.login(credentials)
    const { accessToken, userId, email, role } = loginResponse

    if (role === 'Student') {
      const profile = await studentService.getCurrentStudent(accessToken)
      const currentUser = { userId, email, role, approvalStatus: profile.approvalStatus } as const

      if (profile.approvalStatus === 'Approved') {
        const nextSession = { accessToken, currentUser }
        authSessionStorage.setSession(nextSession)
        setSession(nextSession)
      }

      return currentUser
    }

    const currentUser = { userId, email, role } as const
    const nextSession = { accessToken, currentUser }
    authSessionStorage.setSession(nextSession)
    setSession(nextSession)
    return currentUser
  }, [])

  const refreshStudentApproval = useCallback(async () => {
    const profile = await studentService.getCurrentStudent()
    if (profile.approvalStatus === 'Approved') {
      setSession((currentSession) => {
        if (!currentSession || currentSession.currentUser.role !== 'Student') return currentSession
        const nextSession = {
          ...currentSession,
          currentUser: {
            ...currentSession.currentUser,
            approvalStatus: profile.approvalStatus,
          },
        }
        authSessionStorage.setSession(nextSession)
        return nextSession
      })
    }
    return profile.approvalStatus
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.accessToken ?? null,
      currentUser: session?.currentUser ?? null,
      isAuthenticated: session !== null,
      role: session?.currentUser.role ?? null,
      login,
      refreshStudentApproval,
      logout,
    }),
    [login, logout, refreshStudentApproval, session],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
