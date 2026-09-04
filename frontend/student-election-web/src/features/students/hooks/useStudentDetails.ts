import { useCallback, useRef, useState } from 'react'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { studentService } from '../services/StudentService'
import type { StudentDetails } from '../types/student.types'

export function useStudentDetails() {
  const { showError } = useSnackbar()
  const [student, setStudent] = useState<StudentDetails>()
  const [isLoading, setIsLoading] = useState(false)
  const requestId = useRef(0)

  const open = useCallback(async (studentId: string) => {
    const currentRequestId = ++requestId.current
    setStudent(undefined)
    setIsLoading(true)
    try {
      const details = await studentService.getStudentById(studentId)
      if (currentRequestId === requestId.current) {
        setStudent(details)
        setIsLoading(false)
      }
    } catch (error: unknown) {
      if (currentRequestId !== requestId.current) return
      showError(error instanceof Error ? error.message : 'Unable to load student details.')
      setIsLoading(false)
    }
  }, [showError])

  const close = useCallback(() => {
    requestId.current += 1
    setStudent(undefined)
    setIsLoading(false)
  }, [])

  return { student, isLoading, open, close }
}
