// src/features/students/hooks/usePendingStudents.ts
import { useQuery } from '@tanstack/react-query'
import type { PagedResult } from '@core/types/api'
import { studentKeys } from '@core/query/queryKeys'
import { studentService } from '../services/StudentService'
import type { PendingStudent } from '../types/student.types'

const EMPTY_RESULT: PagedResult<PendingStudent> = {
  items: [],
  pageNumber: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
}

export function usePendingStudents(pageNumber: number, pageSize: number, search: string) {
  const trimmedSearch = search.trim()

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: studentKeys.pending(pageNumber, pageSize, trimmedSearch),
    queryFn: () =>
      studentService.getPendingStudents({
        pageNumber,
        pageSize,
        search: trimmedSearch || undefined,
      }),
    placeholderData: (previousData) => previousData,
  })

  return {
    result: data ?? EMPTY_RESULT,
    error,
    isLoading: isLoading || isFetching,
    refresh: refetch,
  }
}
