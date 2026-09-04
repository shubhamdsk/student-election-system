import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { ApiError } from '@core/api/ApiError'
import { useAuth } from '@core/hooks/useAuth'
import type { ApprovalCheckState } from '@features/students/types/approval.types'
import { getStudentApprovalNotice } from '@features/students/utils/student-approval'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import { useSnackbar } from '@shared/hooks/useSnackbar'

export function ApprovedStudentRoute() {
  const { logout, refreshStudentApproval } = useAuth()
  const { showError, showSnackbar } = useSnackbar()
  const [checkState, setCheckState] = useState<ApprovalCheckState>({ status: 'checking' })

  useEffect(() => {
    let isActive = true

    void refreshStudentApproval()
      .then((approvalStatus) => {
        if (!isActive) return
        const notice = getStudentApprovalNotice(approvalStatus)
        if (notice) {
          showSnackbar(notice)
          logout()
          setCheckState({ status: 'denied', approvalStatus })
          return
        }
        setCheckState({ status: 'approved', approvalStatus })
      })
      .catch((error: unknown) => {
        if (!isActive) return
        const message = error instanceof ApiError
          ? error.message
          : 'Unable to verify your registration status.'
        showError(message)
        setCheckState({ status: 'error' })
      })

    return () => {
      isActive = false
    }
  }, [logout, refreshStudentApproval, showError, showSnackbar])

  if (checkState.status === 'approved') return <Outlet />
  if (checkState.status === 'denied') return <Navigate to="/login" replace />
  if (checkState.status === 'error') return <Navigate to="/unauthorized" replace />

  return <main className="standalone-page"><LoadingSpinner label="Checking registration status" /></main>
}
