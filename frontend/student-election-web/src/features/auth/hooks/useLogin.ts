import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '@core/api/ApiError'
import type { LoginRequest } from '@core/auth/auth.types'
import { useAuth } from '@core/hooks/useAuth'
import { mapValidationErrors, type FieldErrors } from '@core/utils/form-errors'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import type { LoginField, LoginLocationState } from '../types/login.types'
import { getStudentApprovalNotice } from '@features/students/utils/student-approval'

const LOGIN_FIELDS: readonly LoginField[] = ['email', 'password']

export function useLogin() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { showError, showSnackbar, showSuccess } = useSnackbar()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginField>>({})

  const submit = async (credentials: LoginRequest) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setFieldErrors({})
    try {
      const user = await login(credentials)
      if (user.role === 'Student') {
        const approvalNotice = getStudentApprovalNotice(user.approvalStatus)
        if (approvalNotice) {
          showSnackbar(approvalNotice)
          return
        }
      }
      const roleHome = user.role === 'Admin' ? '/admin' : '/student'
      const requestedPath = (location.state as LoginLocationState | null)?.from
      const isSafeRolePath = requestedPath?.startsWith(`/${user.role.toLowerCase()}`) && !requestedPath.startsWith('//')
      const targetPath = isSafeRolePath && requestedPath ? requestedPath : roleHome
      showSuccess('Login successful.')
      navigate(targetPath, { replace: true })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        showError(error.message)
        setFieldErrors(mapValidationErrors(error.validationErrors, LOGIN_FIELDS))
      } else {
        showError('Unable to sign in right now. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, fieldErrors }
}
