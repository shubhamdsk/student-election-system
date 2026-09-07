import type { ElectionStatus } from '@core/types/enums'
import type { FieldErrors } from '@core/utils/form-errors'
import type { ButtonVariant } from '@shared/types/component.types'
import type { ElectionDetails, ElectionListItem, ElectionRequest } from './election.types'

export type ElectionFormField = keyof ElectionRequest
export type ElectionFormMode = 'create' | 'edit'
export type ElectionAction = 'openNominations' | 'startVoting' | 'closeVoting' | 'publishResults' | 'cancel'

export interface ElectionFormValues {
  title: string
  description: string
  nominationStartAt: string
  nominationEndAt: string
  votingStartAt: string
  votingEndAt: string
  maxCandidates: string
}

export interface ElectionToolbarProps {
  search: string
  status: ElectionStatus | ''
  onSearchChange(value: string): void
  onStatusChange(value: ElectionStatus | ''): void
  onCreate(): void
}

export interface ElectionsTableProps {
  elections: ElectionListItem[]
  isLoading: boolean
  hasFilters: boolean
  actionElectionId?: string
  onView(election: ElectionListItem): void
  onEdit(election: ElectionListItem): void
  onAction(election: ElectionListItem, action: ElectionAction): void
}

export interface ElectionStatusBadgeProps { status: ElectionStatus }

export interface ElectionFormDialogProps {
  mode: ElectionFormMode
  election?: ElectionDetails
  isOpen: boolean
  isLoading: boolean
  isSubmitting: boolean
  serverErrors: FieldErrors<ElectionFormField>
  onClose(): void
  onSubmit(request: ElectionRequest): void
}

export interface ElectionDetailsDialogProps {
  election?: ElectionDetails
  isLoading: boolean
  onClose(): void
}

export interface ElectionActionConfig {
  title: string
  message: string
  confirmLabel: string
  successMessage: string
  variant: ButtonVariant
}

export interface ElectionActionSelection {
  election: ElectionListItem
  action: ElectionAction
}

export interface SaveElectionInput {
  mode: ElectionFormMode
  electionId?: string
  request: ElectionRequest
}

export interface ElectionActionDialogProps {
  selection?: ElectionActionSelection
  config?: ElectionActionConfig
  isSubmitting: boolean
  onCancel(): void
  onConfirm(): void
}
