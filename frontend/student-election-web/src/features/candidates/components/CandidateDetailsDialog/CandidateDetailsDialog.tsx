import { useEffect, useRef } from 'react'
import { formatUtcDateTime } from '@core/utils/date'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import type { CandidateDetailsDialogProps } from '../../types/candidate-management.types'
import { CandidateStatusBadge } from '../CandidateStatusBadge/CandidateStatusBadge'
import '../CandidateDialog/CandidateDialog.scss'
import './CandidateDetailsDialog.scss'

const displayOptional = (value: string | null) => value?.trim() || 'Not provided'

export function CandidateDetailsDialog({ candidate, isLoading, onClose }: CandidateDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isOpen = isLoading || Boolean(candidate)
  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && dialog && !dialog.open) dialog.showModal()
    if (!isOpen && dialog?.open) dialog.close()
  }, [isOpen])

  return <dialog ref={dialogRef} className="candidate-dialog" aria-labelledby="candidate-details-title" onCancel={onClose}>
    <header className="candidate-dialog__header"><h2 id="candidate-details-title">Candidate details</h2><Button variant="ghost" aria-label="Close candidate details" onClick={onClose}>Close</Button></header>
    <div className="candidate-dialog__content">
      {isLoading && !candidate ? <LoadingSpinner label="Loading candidate details" /> : candidate && <dl className="candidate-details">
        <div><dt>Student Name</dt><dd>{candidate.studentFullName}</dd></div><div><dt>Registration Number</dt><dd>{candidate.studentRegistrationNumber}</dd></div>
        <div className="candidate-details__wide"><dt>Email</dt><dd>{candidate.studentEmail}</dd></div>
        <div><dt>Election</dt><dd>{candidate.electionTitle}</dd></div><div><dt>Election Status</dt><dd>{candidate.electionStatus}</dd></div>
        <div><dt>Approval Status</dt><dd><CandidateStatusBadge status={candidate.status} /></dd></div><div><dt>Applied At</dt><dd>{formatUtcDateTime(candidate.nominatedAt)}</dd></div>
        <div className="candidate-details__wide"><dt>Manifesto</dt><dd className="candidate-details__manifesto">{displayOptional(candidate.manifesto)}</dd></div>
        {candidate.approvedAt && <div><dt>Approved At</dt><dd>{formatUtcDateTime(candidate.approvedAt)}</dd></div>}
        {candidate.rejectedAt && <div><dt>Rejected At</dt><dd>{formatUtcDateTime(candidate.rejectedAt)}</dd></div>}
        {candidate.rejectionReason && <div className="candidate-details__wide"><dt>Rejection Reason</dt><dd>{candidate.rejectionReason}</dd></div>}
      </dl>}
    </div>
  </dialog>
}
