import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { electionKeys } from '@core/query/queryKeys'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { electionService } from '../services/ElectionService'

export function useElectionDetails(electionId?: string) {
  const { showError } = useSnackbar()
  const query = useQuery({
    queryKey: electionKeys.detail(electionId),
    queryFn: () => electionService.getElectionById(electionId ?? ''),
    enabled: Boolean(electionId),
    retry: false,
  })
  useEffect(() => {
    if (query.error && !query.isFetching) showError(query.error instanceof Error ? query.error.message : 'Unable to load election details.')
  }, [query.error, query.isFetching, showError])
  return { election: query.data, isLoading: query.isLoading || query.isFetching }
}
