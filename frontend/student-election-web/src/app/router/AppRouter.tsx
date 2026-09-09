import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@app/layouts/AdminLayout/AdminLayout'
import { PublicLayout } from '@app/layouts/PublicLayout/PublicLayout'
import { StudentLayout } from '@app/layouts/StudentLayout/StudentLayout'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import { ApprovedStudentRoute } from './ApprovedStudentRoute'

// Public routes
const HomePage = lazy(() => import('@shared/pages/HomePage/HomePage').then(m => ({ default: m.HomePage })))
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage/LoginPage').then(m => ({ default: m.LoginPage })))
const RegistrationPage = lazy(() => import('@features/students/pages/RegistrationPage/RegistrationPage').then(m => ({ default: m.RegistrationPage })))
const UnauthorizedPage = lazy(() => import('@shared/pages/UnauthorizedPage/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })))
const NotFoundPage = lazy(() => import('@shared/pages/NotFoundPage/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

// Student routes
const StudentDashboardPage = lazy(() => import('@features/dashboard/pages/StudentDashboardPage/StudentDashboardPage').then(m => ({ default: m.StudentDashboardPage })))
const StudentElectionsPage = lazy(() => import('@features/elections/pages/StudentElectionsPage/StudentElectionsPage').then(m => ({ default: m.StudentElectionsPage })))
const StudentVotingPage = lazy(() => import('@features/voting/pages/StudentVotingPage/StudentVotingPage').then(m => ({ default: m.StudentVotingPage })))
const StudentResultsPage = lazy(() => import('@features/results/pages/StudentResultsPage/StudentResultsPage').then(m => ({ default: m.StudentResultsPage })))
const StudentCandidatesPage = lazy(() => import('@features/candidates/pages/StudentCandidatesPage/StudentCandidatesPage').then(m => ({ default: m.StudentCandidatesPage })))
const StudentVotingListPage = lazy(() => import('@features/voting/pages/StudentVotingListPage/StudentVotingListPage').then(m => ({ default: m.StudentVotingListPage })))
const StudentProfilePage = lazy(() => import('@features/profile/pages/StudentProfilePage/StudentProfilePage').then(m => ({ default: m.StudentProfilePage })))

// Admin routes
const AdminDashboardPage = lazy(() => import('@features/dashboard/pages/AdminDashboardPage/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))
const AdminStudentsPage = lazy(() => import('@features/students/pages/AdminStudentsPage/AdminStudentsPage').then(m => ({ default: m.AdminStudentsPage })))
const AdminElectionsPage = lazy(() => import('@features/elections/pages/AdminElectionsPage/AdminElectionsPage').then(m => ({ default: m.AdminElectionsPage })))
const AdminCandidatesPage = lazy(() => import('@features/candidates/pages/AdminCandidatesPage/AdminCandidatesPage').then(m => ({ default: m.AdminCandidatesPage })))
const AdminProfilePage = lazy(() => import('@features/profile/pages/AdminProfilePage/AdminProfilePage').then(m => ({ default: m.AdminProfilePage })))

const routeFallback = (
  <div className="page-loading-fallback">
    <LoadingSpinner label="Loading page..." />
  </div>
)

export function AppRouter() {
  return (
    <Suspense fallback={routeFallback}>
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
                <Route index element={<StudentDashboardPage />} />
                <Route path="elections" element={<StudentElectionsPage />} />
                <Route path="elections/:electionId/vote" element={<StudentVotingPage />} />
                <Route path="elections/:electionId/results" element={<StudentResultsPage />} />
                <Route path="candidates" element={<StudentCandidatesPage />} />
                <Route path="voting" element={<StudentVotingListPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
              </Route>
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRole="Admin" />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="students" element={<AdminStudentsPage />} />
              <Route path="elections" element={<AdminElectionsPage />} />
              <Route path="candidates" element={<AdminCandidatesPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
