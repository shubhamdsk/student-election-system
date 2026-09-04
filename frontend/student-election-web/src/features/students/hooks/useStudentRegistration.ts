import { useState } from 'react'
import { ApiError } from '@core/api/ApiError'
import { mapValidationErrors, type FieldErrors } from '@core/utils/form-errors'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { studentService } from '../services/StudentService'
import type { RegisterStudentRequest, RegisterStudentResponse, RegistrationField } from '../types/student.types'

const REGISTRATION_FIELDS: readonly RegistrationField[] = [
  'email', 'password', 'registrationNumber', 'fullName',
  'department', 'yearOfStudy', 'gender', 'phoneNumber',
]

export function useStudentRegistration() {
  const { showError, showSuccess } = useSnackbar()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegistrationField>>({})
  const [registration, setRegistration] = useState<RegisterStudentResponse>()

  const submit = async (request: RegisterStudentRequest) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setFieldErrors({})
    try {
      const response = await studentService.registerStudent(request)
      setRegistration(response)
      showSuccess('Registration submitted successfully.')
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        showError(error.message)
        setFieldErrors(mapValidationErrors(error.validationErrors, REGISTRATION_FIELDS))
      } else {
        showError('Unable to submit your registration right now. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, registration, isSubmitting, fieldErrors }
}
