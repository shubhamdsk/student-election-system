import { useQuery } from '@tanstack/react-query'
import { candidateKeys } from '@core/query/queryKeys'
import { candidateService } from '../services/CandidateService'
import type { CandidateApplication } from '../types/candidate.types'

const EMPTY: CandidateApplication[] = []

export function useMyCandidateApplications() {
  const query = useQuery({
    queryKey: candidateKeys.myApplications(),
    queryFn: () => candidateService.getMyApplications(),
    retry: false,
  })

  return {
    applications: query.data ?? EMPTY,
    error: query.error,
    isLoading: query.isLoading || query.isFetching,
    refresh: query.refetch,
  }
}
