import { useQuery } from '@tanstack/react-query'
import { resultKeys } from '@core/query/queryKeys'
import { resultService } from '../services/ResultService'

export function useElectionResults(electionId?: string) {
  const query = useQuery({
    queryKey: resultKeys.detail(electionId),
    queryFn: () => {
      if (!electionId) throw new Error('Election ID is required.')
      return resultService.getElectionResults(electionId)
    },
    enabled: Boolean(electionId),
  })

  return {
    results: query.data,
    error: query.error,
    isLoading: query.isLoading || query.isFetching,
    retry: query.refetch,
  }
}
