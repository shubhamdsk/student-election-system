import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@core/hooks/useAuth'
import type { RoleRouteProps } from '@core/types/routing'

export function RoleRoute({ allowedRole }: RoleRouteProps) {
  const { role } = useAuth()
  return role === allowedRole ? <Outlet /> : <Navigate to="/unauthorized" replace />
}
