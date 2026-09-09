import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { ApiError } from '@core/api/ApiError'
import { useAuth } from '@core/hooks/useAuth'
import { useCurrentStudentProfile } from '@features/profile/hooks/useCurrentStudentProfile'
import { getStudentApprovalNotice } from '@features/students/utils/student-approval'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import './ApprovedStudentRoute.scss'

export function ApprovedStudentRoute() {
  const { logout } = useAuth()
  const { showError, showSnackbar } = useSnackbar()
  const { data: profile, isLoading, isError, error } = useCurrentStudentProfile()

  const notice = profile ? getStudentApprovalNotice(profile.approvalStatus) : null

  useEffect(() => {
    if (!notice) return

    showSnackbar(notice)
    logout()
  }, [logout, notice, showSnackbar])

  if (isError) {
    const message = error instanceof ApiError
      ? error.message
      : 'Unable to verify your registration status.'
    showError(message)
    return <Navigate to="/unauthorized" replace />
  }

  if (isLoading || !profile) {
    return (
      <main className="approval-check-page">
        <section className="approval-check" aria-labelledby="approval-check-title">
          <div className="approval-check__icon" aria-hidden="true">
            <span className="approval-check__icon-ring" />
            <span className="approval-check__icon-mark">✓</span>
          </div>
          <p className="approval-check__eyebrow">Student portal</p>
          <h1 className="approval-check__title" id="approval-check-title">Verifying your registration</h1>
          <p className="approval-check__description">
            We’re confirming your student approval status before opening the portal.
          </p>
          <div className="approval-check__status">
            <LoadingSpinner label="Checking registration status..." />
          </div>
        </section>
      </main>
    )
  }

  if (notice) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
