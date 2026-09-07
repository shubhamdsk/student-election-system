import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@core/api/ApiError'
import { electionKeys } from '@core/query/queryKeys'
import { mapValidationErrors, type FieldErrors } from '@core/utils/form-errors'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { electionService } from '../services/ElectionService'
import type { ElectionFormField, SaveElectionInput } from '../types/election-management.types'

const FIELDS: readonly ElectionFormField[] = ['title', 'description', 'nominationStartAt', 'nominationEndAt', 'votingStartAt', 'votingEndAt', 'maxCandidates']

export function useElectionForm(onSaved: () => void) {
  const queryClient = useQueryClient()
  const { showError, showSuccess } = useSnackbar()
  const [serverErrors, setServerErrors] = useState<FieldErrors<ElectionFormField>>({})
  const mutation = useMutation({
    mutationFn: async ({ mode, electionId, request }: SaveElectionInput) => {
      if (mode === 'create') return electionService.createElection(request)
      if (!electionId) throw new Error('Election ID is required for editing.')
      await electionService.updateElection(electionId, request)
    },
    onMutate: () => setServerErrors({}),
    onSuccess: (_data, input) => {
      showSuccess(input.mode === 'create' ? 'Election created successfully.' : 'Election updated successfully.')
      void queryClient.invalidateQueries({ queryKey: electionKeys.all })
      onSaved()
    },
    onError: (error: unknown) => {
      showError(error instanceof Error ? error.message : 'Unable to save the election.')
      if (error instanceof ApiError) setServerErrors(mapValidationErrors(error.validationErrors, FIELDS))
    },
  })
  return { save: mutation.mutate, isSubmitting: mutation.isPending, serverErrors, clearErrors: () => setServerErrors({}) }
}
