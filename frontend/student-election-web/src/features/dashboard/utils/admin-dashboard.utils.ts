import type { ElectionStatus } from '@core/types/enums'
import type { ElectionListItem } from '@features/elections/types/election.types'
import type { AdminAttentionItem, AdminElectionView } from '../types'

const ATTENTION_LIMIT = 5

const ELECTION_PRIORITY = {
  Closed: 3,
  Voting: 4,
  Nominations: 5,
  Draft: 6,
  ResultPublished: 7,
  Cancelled: 8,
} as const

const ELECTION_ATTENTION_CONFIG: Record<ElectionStatus, { title: string; message: string; tone: AdminAttentionItem['tone'] }> = {
  Draft: { title: 'Election Setup In Progress', message: 'Complete the election setup when ready.', tone: 'muted' },
  Nominations: { title: 'Nominations Are Open', message: 'Manage applications and start voting when ready.', tone: 'primary' },
  Voting: { title: 'Voting Is Active', message: 'Voting is currently open. Manage the election lifecycle.', tone: 'primary' },
  Closed: { title: 'Results Awaiting Publication', message: 'Voting has closed. Review and publish results when ready.', tone: 'warning' },
  ResultPublished: { title: 'Results Published', message: 'Results are available to students.', tone: 'muted' },
  Cancelled: { title: 'Election Cancelled', message: 'This election has been cancelled.', tone: 'muted' },
}

export function buildAdminAttentionItems(
  pendingStudentCount: number,
  pendingCandidateCount: number,
  elections: ElectionListItem[],
): AdminAttentionItem[] {
  const items: Array<AdminAttentionItem & { order: number }> = []

  if (pendingStudentCount > 0) {
    items.push({ id: 'pending-students', priority: 1, order: 0, title: 'Pending Student Registrations', message: `${pendingStudentCount} ${pendingStudentCount === 1 ? 'student is' : 'students are'} waiting for approval.`, actionLabel: 'Review Students', path: '/admin/students', tone: 'danger' })
  }
  if (pendingCandidateCount > 0) {
    items.push({ id: 'pending-candidates', priority: 2, order: 0, title: 'Pending Candidate Applications', message: `${pendingCandidateCount} candidate ${pendingCandidateCount === 1 ? 'application is' : 'applications are'} waiting for review.`, actionLabel: 'Review Candidates', path: '/admin/candidates', tone: 'warning' })
  }

  elections.forEach((election, order) => {
    const config = ELECTION_ATTENTION_CONFIG[election.status]

    items.push({ id: `election-${election.id}`, priority: ELECTION_PRIORITY[election.status], order, title: config.title, message: `${election.title}: ${config.message}`, actionLabel: 'Manage Election', path: '/admin/elections', tone: config.tone })
  })

  return items.sort((left, right) => left.priority - right.priority || left.order - right.order).slice(0, ATTENTION_LIMIT)
}

export function buildAdminElectionView(election: ElectionListItem): AdminElectionView {
  if (election.status === 'Nominations') {
    return { id: election.id, title: election.title, status: election.status, activityLabel: 'Nominations close', activityAt: election.nominationEndAt, message: 'Nominations are currently open.' }
  }
  if (election.status === 'Voting') {
    return { id: election.id, title: election.title, status: election.status, activityLabel: 'Voting closes', activityAt: election.votingEndAt, message: 'Voting is currently active.' }
  }
  if (election.status === 'Closed') {
    return { id: election.id, title: election.title, status: election.status, activityLabel: 'Voting ended', activityAt: election.votingEndAt, message: 'Results are awaiting publication.' }
  }
  if (election.status === 'ResultPublished') {
    return { id: election.id, title: election.title, status: election.status, activityLabel: 'Voting ended', activityAt: election.votingEndAt, message: 'Results have been published.' }
  }
  if (election.status === 'Draft') {
    return { id: election.id, title: election.title, status: election.status, activityLabel: 'Created', activityAt: election.createdAt, message: 'Election setup is still in progress.' }
  }
  return { id: election.id, title: election.title, status: election.status, activityLabel: 'Created', activityAt: election.createdAt, message: 'This election has been cancelled.' }
}
