import { useQuery } from '@tanstack/react-query'
import { candidateKeys } from '@core/query/queryKeys'
import { candidateService } from '../services/CandidateService'

export function useCandidateDetails(candidateId?: string) {
  const query = useQuery({
    queryKey: candidateKeys.detail(candidateId),
    queryFn: () => candidateService.getCandidateById(candidateId ?? ''),
    enabled: Boolean(candidateId),
    retry: false,
  })

  return { candidate: query.data, isLoading: query.isLoading || query.isFetching, refresh: query.refetch }
}
