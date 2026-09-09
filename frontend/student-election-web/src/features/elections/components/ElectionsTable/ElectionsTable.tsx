import { useMemo } from 'react'
import Table from '@components/Table/Table'
import { formatUtcDateTime } from '@core/utils/date'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import type { Column } from '@shared/types/table.types'
import type { ElectionListItem } from '../../types/election.types'
import type { ElectionsTableProps } from '../../types/election-management.types'
import { getElectionActions, ELECTION_ACTION_CONFIG } from '../../utils/election-actions'
import { ElectionStatusBadge } from '../ElectionStatusBadge/ElectionStatusBadge'
import './ElectionsTable.scss'

export function ElectionsTable({ elections, isLoading, hasFilters, actionElectionId, onView, onEdit, onAction }: ElectionsTableProps) {
  const columns = useMemo((): Column<ElectionListItem>[] => [
    { key: 'title', header: 'Title', width: '16rem', filterable: false },
    { key: 'status', header: 'Status', width: '9.5rem', maxWidth: '9.5rem', align: 'center', filterable: false, render: (election) => <ElectionStatusBadge status={election.status} /> },
    { key: 'nominations', header: 'Nomination Period', width: '20rem', sortable: false, filterable: false, render: (election) => `${formatUtcDateTime(election.nominationStartAt)} – ${formatUtcDateTime(election.nominationEndAt)}` },
    { key: 'voting', header: 'Voting Period', width: '20rem', sortable: false, filterable: false, render: (election) => `${formatUtcDateTime(election.votingStartAt)} – ${formatUtcDateTime(election.votingEndAt)}` },
    { key: 'maxCandidates', header: 'Max Candidates', width: '9rem', filterable: false, render: (election) => election.maxCandidates ?? 'No limit' },
    { key: 'createdAt', header: 'Created At', width: '13rem', filterable: false, render: (election) => formatUtcDateTime(election.createdAt) },
    {
      key: 'actions', header: 'Actions', width: '22rem', maxWidth: '22rem', sticky: 'right', sortable: false, filterable: false, render: (election) => <div className="elections-table__actions">
        <Button variant="ghost" size="small" onClick={() => onView(election)}>View</Button>
        {election.status === 'Draft' && <Button variant="secondary" size="small" onClick={() => onEdit(election)}>Edit</Button>}
        {getElectionActions(election.status).map((action) => <Button key={action} variant={ELECTION_ACTION_CONFIG[action].variant} size="small" disabled={Boolean(actionElectionId)} isLoading={actionElectionId === election.id} loadingLabel="Working" onClick={() => onAction(election, action)}>{ELECTION_ACTION_CONFIG[action].confirmLabel}</Button>)}
      </div>
    },
  ], [actionElectionId, onAction, onEdit, onView])

  return <Table columns={columns} data={elections} keyExtractor={(election: ElectionListItem) => election.id} loading={isLoading} loadingContent={<LoadingSpinner label="Loading elections" />} emptyMessage={hasFilters ? 'No elections match the current filters.' : 'No elections found.'} caption="Election management" className="elections-table" />
}
