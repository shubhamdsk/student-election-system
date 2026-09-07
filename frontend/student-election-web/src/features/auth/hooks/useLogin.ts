// src/features/auth/hooks/useLogin.ts
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ApiError } from '@core/api/ApiError'
import type { LoginRequest } from '@core/auth/auth.types'
import { useAuth } from '@core/hooks/useAuth'
import { mapValidationErrors, type FieldErrors } from '@core/utils/form-errors'
import { getStudentApprovalNotice } from '@features/students/utils/student-approval'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import type { LoginField, LoginLocationState } from '../types/login.types'

const LOGIN_FIELDS: readonly LoginField[] = ['email', 'password']

export function useLogin() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { showError, showSnackbar, showSuccess } = useSnackbar()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginField>>({})

  const mutation = useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: (user) => {
      setFieldErrors({})
      if (user.role === 'Student') {
        const approvalNotice = getStudentApprovalNotice(user.approvalStatus)
        if (approvalNotice) {
          showSnackbar(approvalNotice)
          return
        }
      }
      const roleHome = user.role === 'Admin' ? '/admin' : '/student'
      const requestedPath = (location.state as LoginLocationState | null)?.from
      const isSafeRolePath =
        requestedPath?.startsWith(`/${user.role.toLowerCase()}`) && !requestedPath.startsWith('//')
      const targetPath = isSafeRolePath && requestedPath ? requestedPath : roleHome
      showSuccess('Login successful.')
      navigate(targetPath, { replace: true })
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        showError(error.message)
        setFieldErrors(mapValidationErrors(error.validationErrors, LOGIN_FIELDS))
      } else {
        showError('Unable to sign in right now. Please try again.')
      }
    },
  })

  const submit = async (credentials: LoginRequest) => {
    if (mutation.isPending) return
    setFieldErrors({})
    await mutation.mutateAsync(credentials).catch(() => {})
  }

  return {
    submit,
    isSubmitting: mutation.isPending,
    fieldErrors,
  }
}
