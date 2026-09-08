import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { votingKeys } from '@core/query/queryKeys'
import { useMyCandidateApplications } from '@features/candidates/hooks/useMyCandidateApplications'
import { useElections } from '@features/elections/hooks/useElections'
import { votingService } from '@features/voting/services/VotingService'
import { buildAttentionItems, buildLatestElectionView, sortApplicationsByActivity } from '../utils/dashboard.utils'

const DASHBOARD_ELECTION_LIMIT = 5
const DASHBOARD_APPLICATION_LIMIT = 3
const DASHBOARD_RESULT_LIMIT = 3

export function useStudentDashboard() {
  const electionsQuery = useElections({ pageNumber: 1, pageSize: DASHBOARD_ELECTION_LIMIT })
  const applicationsQuery = useMyCandidateApplications()
  const elections = electionsQuery.result.items
  const votingElections = elections.filter((election) => election.status === 'Voting')
  const participationQueries = useQueries({
    queries: votingElections.map((election) => ({
      queryKey: votingKeys.participation(election.id),
      queryFn: () => votingService.getParticipation(election.id),
    })),
  })

  const unvotedElectionIds = useMemo(() => new Set(
    votingElections
      .filter((_, index) => participationQueries[index]?.data?.hasVoted === false)
      .map((election) => election.id),
  ), [participationQueries, votingElections])

  const sortedApplications = useMemo(
    () => sortApplicationsByActivity(applicationsQuery.applications),
    [applicationsQuery.applications],
  )
  const attentionItems = useMemo(
    () => buildAttentionItems(elections, sortedApplications, unvotedElectionIds),
    [elections, sortedApplications, unvotedElectionIds],
  )

  return {
    attentionItems,
    latestElections: elections
      .slice(0, DASHBOARD_ELECTION_LIMIT)
      .map((election) => buildLatestElectionView(election, unvotedElectionIds.has(election.id))),
    applications: sortedApplications.slice(0, DASHBOARD_APPLICATION_LIMIT),
    recentResults: elections.filter((election) => election.status === 'ResultPublished').slice(0, DASHBOARD_RESULT_LIMIT),
    isElectionsLoading: electionsQuery.isLoading,
    isApplicationsLoading: applicationsQuery.isLoading,
    isParticipationLoading: participationQueries.some((query) => query.isLoading),
    electionsError: electionsQuery.error,
    applicationsError: applicationsQuery.error,
    hasParticipationError: participationQueries.some((query) => query.isError),
    retryElections: electionsQuery.refresh,
    retryApplications: applicationsQuery.refresh,
    retryParticipation: () => participationQueries.forEach((query) => { void query.refetch() }),
  }
}
