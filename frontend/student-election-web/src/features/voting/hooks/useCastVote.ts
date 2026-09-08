import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@core/api/ApiError'
import { electionKeys, votingKeys } from '@core/query/queryKeys'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { votingService } from '../services/VotingService'
import type { CastVoteRequest } from '../types/voting.types'

interface UseCastVoteOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useCastVote(electionId: string, options?: UseCastVoteOptions) {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()

  return useMutation({
    mutationFn: (request: CastVoteRequest) => votingService.castVote(electionId, request),
    onSuccess: () => {
      showSuccess('Your vote has been submitted successfully.')
      void queryClient.invalidateQueries({ queryKey: votingKeys.all })
      void queryClient.invalidateQueries({ queryKey: electionKeys.all })
      options?.onSuccess?.()
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to cast vote. Please try again.'
      showError(message)
      void queryClient.invalidateQueries({ queryKey: votingKeys.participation(electionId) })
      void queryClient.invalidateQueries({ queryKey: electionKeys.detail(electionId) })
      if (error instanceof ApiError && error.status === 409) {
        void queryClient.invalidateQueries({ queryKey: votingKeys.all })
        void queryClient.invalidateQueries({ queryKey: electionKeys.all })
      }
      options?.onError?.(error)
    },
  })
}
