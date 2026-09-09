import { useState } from 'react'
import type { ElectionStatus } from '@core/types/enums'
import { Pagination } from '@shared/components/Pagination/Pagination'
import { useDebouncedSearch } from '@shared/hooks/useDebouncedSearch'
import { ElectionActionDialog } from '../../components/ElectionActionDialog/ElectionActionDialog'
import { ElectionDetailsDialog } from '../../components/ElectionDetailsDialog/ElectionDetailsDialog'
import { ElectionFormDialog } from '../../components/ElectionFormDialog/ElectionFormDialog'
import { ElectionsTable } from '../../components/ElectionsTable/ElectionsTable'
import { ElectionToolbar } from '../../components/ElectionToolbar/ElectionToolbar'
import { useElectionActions } from '../../hooks/useElectionActions'
import { useElectionDetails } from '../../hooks/useElectionDetails'
import { useElectionForm } from '../../hooks/useElectionForm'
import { useElections } from '../../hooks/useElections'
import type { ElectionActionSelection, ElectionFormMode } from '../../types/election-management.types'
import { ELECTION_ACTION_CONFIG } from '../../utils/election-actions'
import './AdminElectionsPage.scss'

const PAGE_SIZE = 10

export function AdminElectionsPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ElectionStatus | ''>('')
  const [formMode, setFormMode] = useState<ElectionFormMode>()
  const [editId, setEditId] = useState<string>()
  const [detailsId, setDetailsId] = useState<string>()
  const [actionSelection, setActionSelection] = useState<ElectionActionSelection>()
  const debouncedSearch = useDebouncedSearch(search, 300, 3)
  const elections = useElections({ pageNumber, pageSize, search: debouncedSearch, status: status || undefined })
  const details = useElectionDetails(detailsId)
  const editDetails = useElectionDetails(editId)
  const closeForm = () => { setFormMode(undefined); setEditId(undefined) }
  const form = useElectionForm(closeForm)
  const actions = useElectionActions(() => setActionSelection(undefined))

  return <section className="admin-elections-page" aria-label="Election management">
    <ElectionToolbar search={search} status={status} onSearchChange={(value) => { setSearch(value); setPageNumber(1) }} onStatusChange={(value) => { setStatus(value); setPageNumber(1) }} onCreate={() => { form.clearErrors(); setFormMode('create') }} />
    <div className="admin-elections-page__content"><ElectionsTable elections={elections.result.items} isLoading={elections.isLoading} hasFilters={Boolean(debouncedSearch.trim() || status)} actionElectionId={actions.actionElectionId} onView={(election) => setDetailsId(election.id)} onEdit={(election) => { form.clearErrors(); setEditId(election.id); setFormMode('edit') }} onAction={(election, action) => setActionSelection({ election, action })} /></div>
    <Pagination ariaLabel="Elections pagination" pageNumber={elections.result.pageNumber || pageNumber} pageSize={pageSize} totalCount={elections.result.totalCount} totalPages={elections.result.totalPages} isDisabled={elections.isLoading} onPageChange={setPageNumber} onPageSizeChange={(value) => { setPageSize(value); setPageNumber(1) }} />
    {detailsId && <ElectionDetailsDialog election={details.election} isLoading={details.isLoading} onClose={() => setDetailsId(undefined)} />}
    {formMode && <ElectionFormDialog key={editDetails.election?.id ?? formMode} mode={formMode} election={formMode === 'edit' ? editDetails.election : undefined} isOpen isLoading={formMode === 'edit' && editDetails.isLoading} isSubmitting={form.isSubmitting} serverErrors={form.serverErrors} onClose={closeForm} onSubmit={(request) => form.save({ mode: formMode, electionId: editId, request })} />}
    <ElectionActionDialog selection={actionSelection} config={actionSelection ? ELECTION_ACTION_CONFIG[actionSelection.action] : undefined} isSubmitting={actions.isSubmitting} onCancel={() => setActionSelection(undefined)} onConfirm={() => { if (actionSelection) actions.runAction(actionSelection) }} />
  </section>
}
