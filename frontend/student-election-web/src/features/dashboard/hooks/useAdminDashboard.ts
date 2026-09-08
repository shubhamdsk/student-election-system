import { useMemo } from 'react'
import { usePendingStudents } from '@features/students/hooks/usePendingStudents'
import { usePendingCandidates } from '@features/candidates/hooks/usePendingCandidates'
import { useElections } from '@features/elections/hooks/useElections'
import { buildAdminAttentionItems, buildAdminElectionView } from '../utils/admin-dashboard.utils'

const DASHBOARD_PAGE_SIZE = 5

export function useAdminDashboard() {
  const studentsQuery = usePendingStudents(1, DASHBOARD_PAGE_SIZE, '')
  const candidatesQuery = usePendingCandidates(1, DASHBOARD_PAGE_SIZE, '')
  const electionsQuery = useElections({ pageNumber: 1, pageSize: DASHBOARD_PAGE_SIZE })

  const attentionItems = useMemo(() => buildAdminAttentionItems(
    studentsQuery.result.totalCount,
    candidatesQuery.result.totalCount,
    electionsQuery.result.items,
  ), [candidatesQuery.result.totalCount, electionsQuery.result.items, studentsQuery.result.totalCount])

  return {
    attentionItems,
    students: studentsQuery.result,
    candidates: candidatesQuery.result,
    elections: electionsQuery.result.items.map(buildAdminElectionView),
    isStudentsLoading: studentsQuery.isLoading,
    isCandidatesLoading: candidatesQuery.isLoading,
    isElectionsLoading: electionsQuery.isLoading,
    studentsError: studentsQuery.error,
    candidatesError: candidatesQuery.error,
    electionsError: electionsQuery.error,
    hasAttentionError: Boolean(studentsQuery.error || candidatesQuery.error || electionsQuery.error),
    retryStudents: studentsQuery.refresh,
    retryCandidates: candidatesQuery.refresh,
    retryElections: electionsQuery.refresh,
  }
}
