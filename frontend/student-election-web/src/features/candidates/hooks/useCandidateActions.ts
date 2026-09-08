import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@core/api/ApiError'
import { candidateKeys } from '@core/query/queryKeys'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { candidateService } from '../services/CandidateService'
import type { CandidateActionRequest, CandidateActionState } from '../types/candidate-management.types'

export function useCandidateActions(onChanged: (isConflict: boolean) => void) {
  const { showError, showSuccess } = useSnackbar()
  const queryClient = useQueryClient()
  const [actionState, setActionState] = useState<CandidateActionState>({})

  const finish = (message: string) => {
    showSuccess(message)
    void queryClient.invalidateQueries({ queryKey: candidateKeys.all })
    onChanged(false)
  }
  const fail = (error: unknown, fallback: string) => {
    showError(error instanceof Error ? error.message : fallback)
    if (error instanceof ApiError && error.status === 409) {
      void queryClient.invalidateQueries({ queryKey: candidateKeys.all })
      onChanged(true)
    }
  }

  const approveMutation = useMutation({
    mutationFn: (candidateId: string) => candidateService.approveCandidate(candidateId),
    onMutate: (candidateId) => setActionState({ candidateId, type: 'approve' }),
    onSuccess: () => finish('Candidate approved successfully.'),
    onError: (error) => fail(error, 'Unable to approve the candidate.'),
    onSettled: () => setActionState({}),
  })
  const rejectMutation = useMutation({
    mutationFn: ({ candidateId, reason }: CandidateActionRequest) =>
      candidateService.rejectCandidate(candidateId, { reason: reason ?? '' }),
    onMutate: ({ candidateId }) => setActionState({ candidateId, type: 'reject' }),
    onSuccess: () => finish('Candidate rejected successfully.'),
    onError: (error) => fail(error, 'Unable to reject the candidate.'),
    onSettled: () => setActionState({}),
  })

  const approve = async (candidateId: string) => {
    try { await approveMutation.mutateAsync(candidateId); return true } catch { return false }
  }
  const reject = async (candidateId: string, reason: string) => {
    try { await rejectMutation.mutateAsync({ candidateId, reason }); return true } catch { return false }
  }

  return {
    approve,
    reject,
    actionCandidateId: actionState.candidateId,
    actionType: actionState.type,
  }
}
