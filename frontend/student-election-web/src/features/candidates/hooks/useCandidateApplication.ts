import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@core/api/ApiError'
import { candidateKeys, electionKeys } from '@core/query/queryKeys'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { candidateService } from '../services/CandidateService'

export function useCandidateApplication() {
  const { showSuccess, showError, showWarning } = useSnackbar()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ electionId, manifesto }: { electionId: string; manifesto: string }) =>
      candidateService.apply(electionId, { manifesto: manifesto.trim() || null }),
    onSuccess: () => {
      showSuccess('Candidate application submitted successfully.')
      void queryClient.invalidateQueries({ queryKey: candidateKeys.myApplications() })
      void queryClient.invalidateQueries({ queryKey: electionKeys.lists() })
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError && error.status === 409) {
        showWarning(error.message || 'You have already applied to this election.')
        void queryClient.invalidateQueries({ queryKey: candidateKeys.myApplications() })
      } else {
        showError(error instanceof Error ? error.message : 'Unable to submit candidate application.')
      }
    },
  })

  return {
    apply: (electionId: string, manifesto: string) => mutation.mutateAsync({ electionId, manifesto }),
    isSubmitting: mutation.isPending,
  }
}
