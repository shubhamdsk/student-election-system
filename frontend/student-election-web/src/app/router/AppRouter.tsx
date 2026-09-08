import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@app/layouts/AdminLayout/AdminLayout'
import { PublicLayout } from '@app/layouts/PublicLayout/PublicLayout'
import { StudentLayout } from '@app/layouts/StudentLayout/StudentLayout'
import { LoginPage } from '@features/auth/pages/LoginPage/LoginPage'
import { AdminElectionsPage } from '@features/elections/pages/AdminElectionsPage/AdminElectionsPage'
import { StudentElectionsPage } from '@features/elections/pages/StudentElectionsPage/StudentElectionsPage'
import { AdminCandidatesPage } from '@features/candidates/pages/AdminCandidatesPage/AdminCandidatesPage'
import { StudentCandidatesPage } from '@features/candidates/pages/StudentCandidatesPage/StudentCandidatesPage'
import { RegistrationPage } from '@features/students/pages/RegistrationPage/RegistrationPage'
import { AdminStudentsPage } from '@features/students/pages/AdminStudentsPage/AdminStudentsPage'
import { PlaceholderPage } from '@shared/components/PlaceholderPage/PlaceholderPage'
import { HomePage } from '@shared/pages/HomePage/HomePage'
import { NotFoundPage } from '@shared/pages/NotFoundPage/NotFoundPage'
import { UnauthorizedPage } from '@shared/pages/UnauthorizedPage/UnauthorizedPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import { ApprovedStudentRoute } from './ApprovedStudentRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegistrationPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="Student" />}>
          <Route element={<ApprovedStudentRoute />}>
            <Route path="student" element={<StudentLayout />}>
              <Route index element={<PlaceholderPage title="Student dashboard" />} />
              <Route path="elections" element={<StudentElectionsPage />} />
              <Route path="candidates" element={<StudentCandidatesPage />} />
              <Route path="voting" element={<PlaceholderPage title="Voting" />} />
              <Route path="results" element={<PlaceholderPage title="Results" />} />
            </Route>
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRole="Admin" />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<PlaceholderPage title="Admin dashboard" />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="elections" element={<AdminElectionsPage />} />
            <Route path="candidates" element={<AdminCandidatesPage />} />
            <Route path="results" element={<PlaceholderPage title="Election results" />} />
          </Route>
        </Route>
      </Route>

      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
