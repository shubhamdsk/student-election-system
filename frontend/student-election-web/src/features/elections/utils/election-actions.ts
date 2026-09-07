import type { ElectionAction, ElectionActionConfig } from '../types/election-management.types'
import type { ElectionStatus } from '@core/types/enums'

export const ELECTION_ACTION_CONFIG: Record<ElectionAction, ElectionActionConfig> = {
  openNominations: { title: 'Open nominations?', message: 'Candidate applications will open for this election.', confirmLabel: 'Open Nominations', successMessage: 'Nominations opened successfully.', variant: 'success' },
  startVoting: { title: 'Start voting?', message: 'Starting voting will end the candidate application and approval phase.', confirmLabel: 'Start Voting', successMessage: 'Voting started successfully.', variant: 'success' },
  closeVoting: { title: 'Close voting?', message: 'Closing voting will prevent any additional votes from being cast.', confirmLabel: 'Close Voting', successMessage: 'Voting closed successfully.', variant: 'warning' },
  publishResults: { title: 'Publish results?', message: 'Publishing results will make the final election results available to Students.', confirmLabel: 'Publish Results', successMessage: 'Results published successfully.', variant: 'success' },
  cancel: { title: 'Cancel election?', message: 'This will cancel the election and prevent further lifecycle actions.', confirmLabel: 'Cancel Election', successMessage: 'Election cancelled successfully.', variant: 'danger' },
}

export function getElectionActions(status: ElectionStatus): ElectionAction[] {
  if (status === 'Draft') return ['openNominations', 'cancel']
  if (status === 'Nominations') return ['startVoting', 'cancel']
  if (status === 'Voting') return ['closeVoting']
  if (status === 'Closed') return ['publishResults']
  return []
}
