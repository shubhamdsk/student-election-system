import { useState } from 'react'
import { ApiError } from '@core/api/ApiError'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { studentService } from '../services/StudentService'

export function useStudentApprovalActions(onChanged: () => void) {
  const { showError, showSuccess } = useSnackbar()
  const [actionStudentId, setActionStudentId] = useState<string>()

  const run = async (studentId: string, action: () => Promise<void>, successMessage: string) => {
    if (actionStudentId) return false
    setActionStudentId(studentId)
    try {
      await action()
      showSuccess(successMessage)
      onChanged()
      return true
    } catch (error: unknown) {
      showError(error instanceof Error ? error.message : 'Unable to update the student registration.')
      const hasStateConflict = error instanceof ApiError && error.status === 409
      if (hasStateConflict) onChanged()
      return hasStateConflict
    } finally {
      setActionStudentId(undefined)
    }
  }

  const approve = (studentId: string) => run(
    studentId, () => studentService.approveStudent(studentId), 'Student approved successfully.',
  )
  const reject = (studentId: string, reason: string) => run(
    studentId, () => studentService.rejectStudent(studentId, { reason }), 'Student rejected successfully.',
  )

  return { approve, reject, actionStudentId }
}
