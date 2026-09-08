import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { PagedResult } from '@core/types/api'
import { candidateKeys } from '@core/query/queryKeys'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { candidateService } from '../services/CandidateService'
import type { PendingCandidate } from '../types/candidate.types'

const EMPTY_RESULT: PagedResult<PendingCandidate> = {
  items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0,
}

export function usePendingCandidates(pageNumber: number, pageSize: number, search: string, electionId?: string) {
  const { showError } = useSnackbar()
  const normalizedSearch = search.trim() || undefined
  const query = useQuery({
    queryKey: candidateKeys.pending(pageNumber, pageSize, normalizedSearch, electionId),
    queryFn: () => candidateService.getPendingCandidates({ pageNumber, pageSize, search: normalizedSearch, electionId }),
    placeholderData: (previousData) => previousData,
    retry: false,
  })

  useEffect(() => {
    if (query.error && !query.isFetching) {
      showError(query.error instanceof Error ? query.error.message : 'Unable to load pending candidates.')
    }
  }, [query.error, query.isFetching, showError])

  return { result: query.data ?? EMPTY_RESULT, isLoading: query.isLoading || query.isFetching, refresh: query.refetch }
}
