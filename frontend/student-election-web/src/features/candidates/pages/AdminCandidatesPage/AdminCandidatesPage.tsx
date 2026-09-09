import { useState } from 'react'
import { useElections } from '@features/elections/hooks/useElections'
import { Pagination } from '@shared/components/Pagination/Pagination'
import { useDebouncedSearch } from '@shared/hooks/useDebouncedSearch'
import { ApproveCandidateDialog } from '../../components/ApproveCandidateDialog/ApproveCandidateDialog'
import { CandidateDetailsDialog } from '../../components/CandidateDetailsDialog/CandidateDetailsDialog'
import { CandidateToolbar } from '../../components/CandidateToolbar/CandidateToolbar'
import { CandidatesTable } from '../../components/CandidatesTable/CandidatesTable'
import { RejectCandidateDialog } from '../../components/RejectCandidateDialog/RejectCandidateDialog'
import { useCandidateActions } from '../../hooks/useCandidateActions'
import { useCandidateDetails } from '../../hooks/useCandidateDetails'
import { usePendingCandidates } from '../../hooks/usePendingCandidates'
import type { PendingCandidate } from '../../types/candidate.types'
import './AdminCandidatesPage.scss'

const DEFAULT_PAGE_SIZE = 10

export function AdminCandidatesPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [electionId, setElectionId] = useState('')
  const [detailsId, setDetailsId] = useState<string>()
  const [approvalCandidate, setApprovalCandidate] = useState<PendingCandidate>()
  const [rejectionCandidate, setRejectionCandidate] = useState<PendingCandidate>()
  const debouncedSearch = useDebouncedSearch(search, 300, 3)
  const candidates = usePendingCandidates(pageNumber, pageSize, debouncedSearch, electionId || undefined)
  const electionOptions = useElections({ pageNumber: 1, pageSize: 100 })
  const details = useCandidateDetails(detailsId)

  const actions = useCandidateActions((isConflict) => {
    setApprovalCandidate(undefined)
    setRejectionCandidate(undefined)
    if (isConflict && detailsId) void details.refresh()
    else setDetailsId(undefined)
    if (candidates.result.items.length === 1 && pageNumber > 1) setPageNumber((current) => current - 1)
    else void candidates.refresh()
  })

  const confirmApproval = async () => {
    if (approvalCandidate) await actions.approve(approvalCandidate.candidateId)
  }
  const confirmRejection = async (reason: string) => {
    if (rejectionCandidate) await actions.reject(rejectionCandidate.candidateId, reason)
  }

  return <section className="admin-candidates-page" aria-label="Candidate management">
    <div className="admin-candidates-page__toolbar">
      <CandidateToolbar search={search} electionId={electionId} elections={electionOptions.result?.items ?? []} isLoadingElections={electionOptions.isLoading} onSearchChange={(value) => { setSearch(value); setPageNumber(1) }} onElectionChange={(value) => { setElectionId(value); setPageNumber(1) }} />
    </div>
    <div className="admin-candidates-page__content"><CandidatesTable candidates={candidates.result?.items ?? []} isLoading={candidates.isLoading} hasSearch={Boolean(debouncedSearch || electionId)} actionCandidateId={actions.actionCandidateId} actionType={actions.actionType} onView={(candidate) => setDetailsId(candidate.candidateId)} onApprove={setApprovalCandidate} onReject={setRejectionCandidate} /></div>
    <Pagination ariaLabel="Pending candidates pagination" pageNumber={candidates.result?.pageNumber || pageNumber} pageSize={pageSize} totalCount={candidates.result?.totalCount ?? 0} totalPages={candidates.result?.totalPages ?? 0} isDisabled={candidates.isLoading} onPageChange={setPageNumber} onPageSizeChange={(value) => { setPageSize(value); setPageNumber(1) }} />
    {detailsId && <CandidateDetailsDialog candidate={details.candidate} isLoading={details.isLoading} onClose={() => setDetailsId(undefined)} />}
    <ApproveCandidateDialog candidate={approvalCandidate} isSubmitting={actions.actionCandidateId === approvalCandidate?.candidateId} onCancel={() => setApprovalCandidate(undefined)} onConfirm={() => { void confirmApproval() }} />
    <RejectCandidateDialog candidate={rejectionCandidate} isSubmitting={actions.actionCandidateId === rejectionCandidate?.candidateId} onCancel={() => setRejectionCandidate(undefined)} onConfirm={(reason) => { void confirmRejection(reason) }} />
  </section>
}
