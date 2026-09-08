import type { ApprovalStatus } from '@core/types/enums'
import type { ElectionListItem } from '@features/elections/types/election.types'
import type { CandidateApplication } from '@features/candidates/types/candidate.types'

/** Props for the Apply as Candidate dialog */
export interface ApplyCandidateDialogProps {
  election: ElectionListItem
  isSubmitting: boolean
  onClose(): void
  onSubmit(manifesto: string): void
}

/** Form state for the candidate application form */
export interface CandidateApplicationFormValues {
  manifesto: string
}

export type CandidateApplicationFormField = keyof CandidateApplicationFormValues

/** The resolved application state for one election, derived from My Applications */
export type ElectionApplicationState =
  | { hasApplication: false }
  | { hasApplication: true; application: CandidateApplication; status: ApprovalStatus }

/** Lookup map from electionId → application state, built once per page load */
export type ApplicationsByElection = Map<string, CandidateApplication>

/** Props for the student election card's application action area */
export interface ElectionCardApplicationProps {
  electionId: string
  applicationsByElection: ApplicationsByElection
  electionStatus: ElectionListItem['status']
  onApply(election: ElectionListItem): void
  election: ElectionListItem
}
