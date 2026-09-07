// src/features/students/hooks/useStudentRegistration.ts
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@core/api/ApiError'
import { studentKeys } from '@core/query/queryKeys'
import { mapValidationErrors, type FieldErrors } from '@core/utils/form-errors'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { studentService } from '../services/StudentService'
import type { RegisterStudentRequest, RegisterStudentResponse, RegistrationField } from '../types/student.types'

const REGISTRATION_FIELDS: readonly RegistrationField[] = [
  'email',
  'password',
  'registrationNumber',
  'fullName',
  'department',
  'yearOfStudy',
  'gender',
  'phoneNumber',
]

export function useStudentRegistration() {
  const { showError, showSuccess } = useSnackbar()
  const queryClient = useQueryClient()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegistrationField>>({})
  const [registration, setRegistration] = useState<RegisterStudentResponse>()

  const mutation = useMutation({
    mutationFn: (request: RegisterStudentRequest) => studentService.registerStudent(request),
    onSuccess: (response) => {
      setRegistration(response)
      setFieldErrors({})
      showSuccess('Registration submitted successfully.')
      void queryClient.invalidateQueries({ queryKey: studentKeys.pendingAll() })
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        showError(error.message)
        setFieldErrors(mapValidationErrors(error.validationErrors, REGISTRATION_FIELDS))
      } else {
        showError('Unable to submit your registration right now. Please try again.')
      }
    },
  })

  const submit = async (request: RegisterStudentRequest) => {
    if (mutation.isPending) return
    setFieldErrors({})
    await mutation.mutateAsync(request).catch(() => {})
  }

  return {
    submit,
    registration,
    isSubmitting: mutation.isPending,
    fieldErrors,
  }
}
