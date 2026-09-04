import { useCallback, useEffect, useRef, useState } from 'react'
import type { PagedResult } from '@core/types/api'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { studentService } from '../services/StudentService'
import type { PendingStudent } from '../types/student.types'

const EMPTY_RESULT: PagedResult<PendingStudent> = {
  items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0,
}

export function usePendingStudents(pageNumber: number, pageSize: number, search: string) {
  const { showError } = useSnackbar()
  const [result, setResult] = useState(EMPTY_RESULT)
  const [isLoading, setIsLoading] = useState(true)
  const requestId = useRef(0)

  const load = useCallback(async () => {
    const currentRequestId = ++requestId.current
    setIsLoading(true)
    try {
      const nextResult = await studentService.getPendingStudents({
        pageNumber, pageSize, search: search.trim() || undefined,
      })
      if (currentRequestId === requestId.current) setResult(nextResult)
    } catch (error: unknown) {
      if (currentRequestId !== requestId.current) return
      const message = error instanceof Error ? error.message : 'Unable to load pending students.'
      showError(message)
    } finally {
      if (currentRequestId === requestId.current) setIsLoading(false)
    }
  }, [pageNumber, pageSize, search, showError])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [load])

  return { result, isLoading, refresh: load }
}
