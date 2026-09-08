import { useQuery } from '@tanstack/react-query'
import { votingKeys } from '@core/query/queryKeys'
import { votingService } from '../services/VotingService'

export function useVotingCandidates(electionId?: string) {
  const query = useQuery({
    queryKey: votingKeys.candidates(electionId),
    queryFn: () => (electionId ? votingService.getCandidates(electionId) : Promise.resolve([])),
    enabled: Boolean(electionId),
  })

  return {
    candidates: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
