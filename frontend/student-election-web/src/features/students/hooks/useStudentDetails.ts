// src/features/students/hooks/useStudentDetails.ts
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { studentKeys } from '@core/query/queryKeys'
import { studentService } from '../services/StudentService'

export function useStudentDetails() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>()

  const { data: student, isLoading } = useQuery({
    queryKey: studentKeys.detail(selectedStudentId),
    queryFn: () => studentService.getStudentById(selectedStudentId!),
    enabled: Boolean(selectedStudentId),
  })

  const open = (studentId: string) => {
    setSelectedStudentId(studentId)
  }

  const close = () => {
    setSelectedStudentId(undefined)
  }

  return {
    student: selectedStudentId ? student : undefined,
    isLoading: Boolean(selectedStudentId) && isLoading,
    open,
    close,
  }
}
