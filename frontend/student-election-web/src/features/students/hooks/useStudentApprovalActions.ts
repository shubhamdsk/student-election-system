// src/features/students/hooks/useStudentApprovalActions.ts
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@core/api/ApiError'
import { studentKeys } from '@core/query/queryKeys'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { studentService } from '../services/StudentService'

export function useStudentApprovalActions(onChanged?: () => void) {
  const { showError, showSuccess } = useSnackbar()
  const queryClient = useQueryClient()
  const [actionStudentId, setActionStudentId] = useState<string>()

  const approveMutation = useMutation({
    mutationFn: (studentId: string) => studentService.approveStudent(studentId),
    onMutate: (studentId) => setActionStudentId(studentId),
    onSuccess: () => {
      showSuccess('Student approved successfully.')
      void queryClient.invalidateQueries({ queryKey: studentKeys.all })
      onChanged?.()
    },
    onError: (error: unknown) => {
      showError(error instanceof Error ? error.message : 'Unable to approve the student.')
      if (error instanceof ApiError && error.status === 409) {
        void queryClient.invalidateQueries({ queryKey: studentKeys.all })
        onChanged?.()
      }
    },
    onSettled: () => setActionStudentId(undefined),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ studentId, reason }: { studentId: string; reason: string }) =>
      studentService.rejectStudent(studentId, { reason }),
    onMutate: ({ studentId }) => setActionStudentId(studentId),
    onSuccess: () => {
      showSuccess('Student rejected successfully.')
      void queryClient.invalidateQueries({ queryKey: studentKeys.all })
      onChanged?.()
    },
    onError: (error: unknown) => {
      showError(error instanceof Error ? error.message : 'Unable to reject the student.')
      if (error instanceof ApiError && error.status === 409) {
        void queryClient.invalidateQueries({ queryKey: studentKeys.all })
        onChanged?.()
      }
    },
    onSettled: () => setActionStudentId(undefined),
  })

  const approve = async (studentId: string): Promise<boolean> => {
    try {
      await approveMutation.mutateAsync(studentId)
      return true
    } catch {
      return false
    }
  }

  const reject = async (studentId: string, reason: string): Promise<boolean> => {
    try {
      await rejectMutation.mutateAsync({ studentId, reason })
      return true
    } catch {
      return false
    }
  }

  return { approve, reject, actionStudentId }
}
