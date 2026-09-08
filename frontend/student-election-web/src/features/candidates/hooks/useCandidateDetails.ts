import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { candidateKeys } from '@core/query/queryKeys'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { candidateService } from '../services/CandidateService'

export function useCandidateDetails(candidateId?: string) {
  const { showError } = useSnackbar()
  const query = useQuery({
    queryKey: candidateKeys.detail(candidateId),
    queryFn: () => candidateService.getCandidateById(candidateId ?? ''),
    enabled: Boolean(candidateId),
    retry: false,
  })

  useEffect(() => {
    if (query.error && !query.isFetching) {
      showError(query.error instanceof Error ? query.error.message : 'Unable to load candidate details.')
    }
  }, [query.error, query.isFetching, showError])

  return { candidate: query.data, isLoading: query.isLoading || query.isFetching, refresh: query.refetch }
}
