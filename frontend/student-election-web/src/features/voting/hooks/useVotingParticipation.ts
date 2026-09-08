import { useQuery } from '@tanstack/react-query'
import { votingKeys } from '@core/query/queryKeys'
import { votingService } from '../services/VotingService'

export function useVotingParticipation(electionId?: string) {
  const query = useQuery({
    queryKey: votingKeys.participation(electionId),
    queryFn: () => (electionId ? votingService.getParticipation(electionId) : Promise.resolve({ hasVoted: false })),
    enabled: Boolean(electionId),
  })

  return {
    hasVoted: query.data?.hasVoted ?? false,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
