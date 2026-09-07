import { useEffect, useRef } from 'react'
import { formatUtcDateTime } from '@core/utils/date'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import type { ElectionDetailsDialogProps } from '../../types/election-management.types'
import { ElectionStatusBadge } from '../ElectionStatusBadge/ElectionStatusBadge'
import '../ElectionDialog/ElectionDialog.scss'
import './ElectionDetailsDialog.scss'

export function ElectionDetailsDialog({ election, isLoading, onClose }: ElectionDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal() }, [])
  return <dialog ref={dialogRef} className="election-dialog" aria-labelledby="election-details-title" onCancel={onClose}>
    <header className="election-dialog__header"><h2 id="election-details-title">Election details</h2><Button variant="ghost" aria-label="Close election details" onClick={onClose}>Close</Button></header>
    <div className="election-dialog__content">{isLoading ? <LoadingSpinner label="Loading election details" /> : election && <dl className="election-details">
      <div className="election-details__wide"><dt>Title</dt><dd>{election.title}</dd></div>
      <div className="election-details__wide"><dt>Description</dt><dd>{election.description || 'No description'}</dd></div>
      <div><dt>Status</dt><dd><ElectionStatusBadge status={election.status} /></dd></div><div><dt>Max Candidates</dt><dd>{election.maxCandidates ?? 'No limit'}</dd></div>
      <div><dt>Nomination Start</dt><dd>{formatUtcDateTime(election.nominationStartAt)}</dd></div><div><dt>Nomination End</dt><dd>{formatUtcDateTime(election.nominationEndAt)}</dd></div>
      <div><dt>Voting Start</dt><dd>{formatUtcDateTime(election.votingStartAt)}</dd></div><div><dt>Voting End</dt><dd>{formatUtcDateTime(election.votingEndAt)}</dd></div>
      <div><dt>Created At</dt><dd>{formatUtcDateTime(election.createdAt)}</dd></div>{election.updatedAt && <div><dt>Updated At</dt><dd>{formatUtcDateTime(election.updatedAt)}</dd></div>}
    </dl>}</div>
  </dialog>
}
