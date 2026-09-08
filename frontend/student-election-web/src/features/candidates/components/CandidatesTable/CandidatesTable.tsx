import { useMemo } from 'react'
import { Table } from '@components'
import { formatUtcDateTime } from '@core/utils/date'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import type { Column } from '@shared/types/table.types'
import type { PendingCandidate } from '../../types/candidate.types'
import type { CandidatesTableProps } from '../../types/candidate-management.types'
import { CandidateStatusBadge } from '../CandidateStatusBadge/CandidateStatusBadge'
import './CandidatesTable.scss'

export function CandidatesTable({ candidates, isLoading, hasSearch, actionCandidateId, actionType, onView, onApprove, onReject }: CandidatesTableProps) {
  const columns = useMemo((): Column<PendingCandidate>[] => [
    { key: 'studentFullName', header: 'Student Name', width: '13rem' },
    { key: 'studentRegistrationNumber', header: 'Registration Number', width: '14rem' },
    { key: 'studentEmail', header: 'Email', width: '18rem' },
    { key: 'electionTitle', header: 'Election', width: '17rem' },
    { key: 'status', header: 'Status', width: '7rem', align: 'center', sortable: false, filterable: false, render: () => <CandidateStatusBadge status="Pending" /> },
    { key: 'nominatedAt', header: 'Applied At', width: '13rem', render: (candidate) => formatUtcDateTime(candidate.nominatedAt) },
    { key: 'actions', header: 'Actions', width: '16rem', sticky: 'right', sortable: false, filterable: false, render: (candidate) => {
      const isBusy = actionCandidateId === candidate.candidateId
      return <div className="candidates-table__actions">
        <Button variant="ghost" size="small" disabled={Boolean(actionCandidateId)} onClick={() => onView(candidate)}>View</Button>
        <Button variant="success" size="small" disabled={Boolean(actionCandidateId)} isLoading={isBusy && actionType === 'approve'} loadingLabel="Approving" onClick={() => onApprove(candidate)}>Approve</Button>
        <Button variant="danger" size="small" disabled={Boolean(actionCandidateId)} isLoading={isBusy && actionType === 'reject'} loadingLabel="Rejecting" onClick={() => onReject(candidate)}>Reject</Button>
      </div>
    } },
  ], [actionCandidateId, actionType, onApprove, onReject, onView])

  return <Table columns={columns} data={candidates} keyExtractor={(candidate: PendingCandidate) => candidate.candidateId} loading={isLoading} loadingContent={<LoadingSpinner label="Loading pending candidates" />} emptyMessage={hasSearch ? 'No candidates match the current search.' : 'No pending candidate applications found.'} caption="Pending candidate applications" className="candidates-table__container" />
}
