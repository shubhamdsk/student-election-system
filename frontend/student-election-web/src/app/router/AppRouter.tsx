import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@app/layouts/AdminLayout/AdminLayout'
import { PublicLayout } from '@app/layouts/PublicLayout/PublicLayout'
import { StudentLayout } from '@app/layouts/StudentLayout/StudentLayout'
import { LoginPage } from '@features/auth/pages/LoginPage/LoginPage'
import { PlaceholderPage } from '@shared/components/PlaceholderPage/PlaceholderPage'
import { HomePage } from '@shared/pages/HomePage/HomePage'
import { NotFoundPage } from '@shared/pages/NotFoundPage/NotFoundPage'
import { UnauthorizedPage } from '@shared/pages/UnauthorizedPage/UnauthorizedPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<PlaceholderPage title="Student registration" />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="Student" />}>
          <Route path="student" element={<StudentLayout />}>
            <Route index element={<PlaceholderPage title="Student dashboard" />} />
            <Route path="elections" element={<PlaceholderPage title="Elections" />} />
            <Route path="candidates" element={<PlaceholderPage title="Candidates" />} />
            <Route path="voting" element={<PlaceholderPage title="Voting" />} />
            <Route path="results" element={<PlaceholderPage title="Results" />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRole="Admin" />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<PlaceholderPage title="Admin dashboard" />} />
            <Route path="students" element={<PlaceholderPage title="Student approvals" />} />
            <Route path="elections" element={<PlaceholderPage title="Election management" />} />
            <Route path="candidates" element={<PlaceholderPage title="Candidate management" />} />
            <Route path="results" element={<PlaceholderPage title="Election results" />} />
          </Route>
        </Route>
      </Route>

      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
