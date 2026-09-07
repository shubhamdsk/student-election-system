import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@core/api/ApiError'
import { electionKeys } from '@core/query/queryKeys'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { electionService } from '../services/ElectionService'
import type { ElectionActionSelection } from '../types/election-management.types'
import { ELECTION_ACTION_CONFIG } from '../utils/election-actions'

export function useElectionActions(onSettledAction: () => void) {
  const queryClient = useQueryClient()
  const { showError, showSuccess } = useSnackbar()
  const mutation = useMutation({
    mutationFn: ({ election, action }: ElectionActionSelection) => {
      const actions = {
        openNominations: electionService.openNominations,
        startVoting: electionService.startVoting,
        closeVoting: electionService.closeVoting,
        publishResults: electionService.publishResults,
        cancel: electionService.cancelElection,
      }
      return actions[action].call(electionService, election.id)
    },
    onSuccess: (_data, selection) => {
      showSuccess(ELECTION_ACTION_CONFIG[selection.action].successMessage)
      void queryClient.invalidateQueries({ queryKey: electionKeys.all })
      onSettledAction()
    },
    onError: (error: unknown) => {
      showError(error instanceof Error ? error.message : 'Unable to update the election.')
      if (error instanceof ApiError && error.status === 409) {
        void queryClient.invalidateQueries({ queryKey: electionKeys.all })
        onSettledAction()
      }
    },
  })
  return {
    runAction: mutation.mutate,
    isSubmitting: mutation.isPending,
    actionElectionId: mutation.isPending ? mutation.variables?.election.id : undefined,
  }
}
