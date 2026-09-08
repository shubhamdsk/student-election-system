import type { PendingCandidate, CandidateDetails } from './candidate.types'
import type { ElectionListItem } from '@features/elections/types/election.types'

export interface CandidateToolbarProps {
  search: string
  electionId: string
  elections: ElectionListItem[]
  isLoadingElections: boolean
  onSearchChange(value: string): void
  onElectionChange(value: string): void
}

export interface CandidatesTableProps {
  candidates: PendingCandidate[]
  isLoading: boolean
  hasSearch: boolean
  actionCandidateId?: string
  actionType?: CandidateActionType
  onView(candidate: PendingCandidate): void
  onApprove(candidate: PendingCandidate): void
  onReject(candidate: PendingCandidate): void
}

export type CandidateActionType = 'approve' | 'reject'

export interface CandidateActionState {
  candidateId?: string
  type?: CandidateActionType
}

export interface CandidateStatusBadgeProps {
  status: CandidateDetails['status']
}

export interface CandidateDetailsDialogProps {
  candidate?: CandidateDetails
  isLoading: boolean
  onClose(): void
}

export interface CandidateActionDialogProps {
  candidate?: PendingCandidate
  isSubmitting: boolean
  onCancel(): void
  onConfirm(): void
}

export interface RejectCandidateDialogProps {
  candidate?: PendingCandidate
  isSubmitting: boolean
  onCancel(): void
  onConfirm(reason: string): void
}

export interface RejectCandidateFormValues {
  reason: string
}

export interface CandidateActionRequest {
  candidateId: string
  reason?: string
}
