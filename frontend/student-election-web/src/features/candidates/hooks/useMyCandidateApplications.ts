import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { candidateKeys } from '@core/query/queryKeys'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { candidateService } from '../services/CandidateService'
import type { CandidateApplication } from '../types/candidate.types'

const EMPTY: CandidateApplication[] = []

export function useMyCandidateApplications() {
  const { showError } = useSnackbar()
  const query = useQuery({
    queryKey: candidateKeys.myApplications(),
    queryFn: () => candidateService.getMyApplications(),
    retry: false,
  })

  useEffect(() => {
    if (query.error && !query.isFetching)
      showError(query.error instanceof Error ? query.error.message : 'Unable to load your candidate applications.')
  }, [query.error, query.isFetching, showError])

  return {
    applications: query.data ?? EMPTY,
    error: query.error,
    isLoading: query.isLoading || query.isFetching,
    refresh: query.refetch,
  }
}
