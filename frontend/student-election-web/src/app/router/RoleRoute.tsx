import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@core/hooks/useAuth'
import type { UserRole } from '@core/types/enums'

interface RoleRouteProps {
  allowedRole: UserRole
}

export function RoleRoute({ allowedRole }: RoleRouteProps) {
  const { role } = useAuth()
  return role === allowedRole ? <Outlet /> : <Navigate to="/unauthorized" replace />
}
