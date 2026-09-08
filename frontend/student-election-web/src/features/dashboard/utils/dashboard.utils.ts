import type { CandidateApplication } from '@features/candidates/types/candidate.types'
import type { ElectionListItem } from '@features/elections/types/election.types'
import type { DashboardActionKind, DashboardAttentionItem, DashboardElectionView } from '../types'

const ATTENTION_LIMIT = 5

function applicationActivityAt(application: CandidateApplication): number {
  const value = application.rejectedAt ?? application.approvedAt ?? application.createdAt
  return new Date(value).getTime()
}

export function sortApplicationsByActivity(applications: CandidateApplication[]): CandidateApplication[] {
  return [...applications].sort((left, right) => applicationActivityAt(right) - applicationActivityAt(left))
}

export function getActionPath(actionKind: DashboardActionKind, electionId: string): string {
  if (actionKind === 'vote') return `/student/elections/${electionId}/vote`
  if (actionKind === 'results') return `/student/elections/${electionId}/results`
  if (actionKind === 'application') return '/student/candidates'
  return '/student/elections'
}

export function buildLatestElectionView(election: ElectionListItem, canVote: boolean): DashboardElectionView {
  if (election.status === 'Voting' && canVote) {
    return { id: election.id, title: election.title, status: election.status, dateLabel: 'Voting closes', dateValue: election.votingEndAt, action: { label: 'Vote Now', path: `/student/elections/${election.id}/vote` } }
  }
  if (election.status === 'Nominations') {
    return { id: election.id, title: election.title, status: election.status, dateLabel: 'Applications close', dateValue: election.nominationEndAt, action: { label: 'View Election', path: '/student/elections' } }
  }
  if (election.status === 'ResultPublished') {
    return { id: election.id, title: election.title, status: election.status, dateLabel: 'Voting ended', dateValue: election.votingEndAt, action: { label: 'View Results', path: `/student/elections/${election.id}/results` } }
  }
  return { id: election.id, title: election.title, status: election.status, dateLabel: 'Voting ended', dateValue: election.votingEndAt, action: { label: 'View Election', path: '/student/elections' } }
}

export function buildAttentionItems(
  elections: ElectionListItem[],
  applications: CandidateApplication[],
  unvotedElectionIds: ReadonlySet<string>,
): DashboardAttentionItem[] {
  const applicationsByElection = new Map(applications.map((application) => [application.electionId, application]))
  const items: Array<DashboardAttentionItem & { order: number }> = []

  elections.forEach((election, order) => {
    if (election.status === 'Voting' && unvotedElectionIds.has(election.id)) {
      items.push({ id: `vote-${election.id}`, priority: 1, order, title: 'Voting is open', electionTitle: election.title, message: 'Cast your vote before the voting period closes.', actionLabel: 'Vote Now', actionKind: 'vote', electionId: election.id, tone: 'primary' })
    }
    if (election.status === 'Nominations' && !applicationsByElection.has(election.id)) {
      items.push({ id: `nomination-${election.id}`, priority: 4, order, title: 'Applications are open', electionTitle: election.title, message: 'Candidate applications are currently being accepted.', actionLabel: 'View Election', actionKind: 'election', electionId: election.id, tone: 'info' })
    }
    if (election.status === 'ResultPublished') {
      items.push({ id: `results-${election.id}`, priority: 5, order, title: 'Results published', electionTitle: election.title, message: 'Final election results are now available.', actionLabel: 'View Results', actionKind: 'results', electionId: election.id, tone: 'info' })
    }
    if (election.status === 'Closed') {
      items.push({ id: `closed-${election.id}`, priority: 6, order, title: 'Results awaiting publication', electionTitle: election.title, message: 'Voting has ended. Results have not been published yet.', actionLabel: 'View Election', actionKind: 'election', electionId: election.id, tone: 'muted' })
    }
  })

  applications.forEach((application, order) => {
    if (application.status === 'Rejected') {
      items.push({ id: `rejected-${application.candidateId}`, priority: 2, order, title: 'Application rejected', electionTitle: application.electionTitle, message: application.rejectionReason || 'Review your candidate application status.', actionLabel: 'View Reason', actionKind: 'application', electionId: application.electionId, tone: 'danger' })
    } else if (application.status === 'Approved') {
      items.push({ id: `approved-${application.candidateId}`, priority: 3, order, title: 'Application approved', electionTitle: application.electionTitle, message: 'Your candidate application has been approved.', actionLabel: 'View Application', actionKind: 'application', electionId: application.electionId, tone: 'success' })
    } else {
      items.push({ id: `pending-${application.candidateId}`, priority: 7, order, title: 'Application awaiting review', electionTitle: application.electionTitle, message: 'Your candidate application is awaiting administrator review.', actionLabel: 'View Application', actionKind: 'application', electionId: application.electionId, tone: 'muted' })
    }
  })

  return items.sort((left, right) => left.priority - right.priority || left.order - right.order).slice(0, ATTENTION_LIMIT)
}
