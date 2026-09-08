import { useEffect, useRef } from 'react'
import { Button } from '@shared/components/Button/Button'
import type { CandidateActionDialogProps } from '../../types/candidate-management.types'
import '../CandidateDialog/CandidateDialog.scss'

export function ApproveCandidateDialog({ candidate, isSubmitting, onCancel, onConfirm }: CandidateActionDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (candidate && dialog && !dialog.open) dialog.showModal()
    if (!candidate && dialog?.open) dialog.close()
  }, [candidate])

  return <dialog ref={dialogRef} className="candidate-dialog" aria-labelledby="approve-candidate-title" onCancel={(event) => { if (isSubmitting) event.preventDefault(); else onCancel() }}>
    <header className="candidate-dialog__header"><h2 id="approve-candidate-title">Approve candidate?</h2><Button variant="ghost" aria-label="Close approval confirmation" disabled={isSubmitting} onClick={onCancel}>Close</Button></header>
    <div className="candidate-dialog__content"><p className="candidate-dialog__message">Are you sure you want to approve {candidate?.studentFullName ?? 'this candidate'} for {candidate?.electionTitle ?? 'this election'}?</p></div>
    <div className="candidate-dialog__actions"><Button variant="secondary" disabled={isSubmitting} onClick={onCancel}>Cancel</Button><Button variant="success" disabled={isSubmitting} isLoading={isSubmitting} loadingLabel="Approving" onClick={onConfirm}>Approve</Button></div>
  </dialog>
}
