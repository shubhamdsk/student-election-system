import { useQuery } from '@tanstack/react-query'
import { electionKeys } from '@core/query/queryKeys'
import { electionService } from '../services/ElectionService'

export function useElectionDetails(electionId?: string) {
  const query = useQuery({
    queryKey: electionKeys.detail(electionId),
    queryFn: () => electionService.getElectionById(electionId ?? ''),
    enabled: Boolean(electionId),
    retry: false,
  })
  return { election: query.data, isLoading: query.isLoading || query.isFetching }
}
