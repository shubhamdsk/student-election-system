import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '@shared/components/Button/Button'
import type { RejectCandidateDialogProps, RejectCandidateFormValues } from '../../types/candidate-management.types'
import '../CandidateDialog/CandidateDialog.scss'

const INITIAL_VALUES: RejectCandidateFormValues = { reason: '' }
const MAX_REASON_LENGTH = 500

export function RejectCandidateDialog({ candidate, isSubmitting, onCancel, onConfirm }: RejectCandidateDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [error, setError] = useState('')
  useEffect(() => {
    const dialog = dialogRef.current
    if (candidate && dialog && !dialog.open) { setValues(INITIAL_VALUES); setError(''); dialog.showModal() }
    if (!candidate && dialog?.open) dialog.close()
  }, [candidate])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const reason = values.reason.trim()
    if (!reason) { setError('Reason is required.'); return }
    if (reason.length > MAX_REASON_LENGTH) { setError(`Reason must be ${MAX_REASON_LENGTH} characters or fewer.`); return }
    onConfirm(reason)
  }

  return <dialog ref={dialogRef} className="candidate-dialog" aria-labelledby="reject-candidate-title" onCancel={(event) => { if (isSubmitting) event.preventDefault(); else onCancel() }}>
    <form onSubmit={submit} noValidate>
      <header className="candidate-dialog__header"><h2 id="reject-candidate-title">Reject candidate?</h2><Button variant="ghost" aria-label="Close rejection dialog" disabled={isSubmitting} onClick={onCancel}>Close</Button></header>
      <div className="candidate-dialog__content"><div className="candidate-dialog__field"><label htmlFor="candidate-rejection-reason">Reason for rejecting {candidate?.studentFullName ?? 'candidate'} <span aria-hidden="true">*</span></label><textarea id="candidate-rejection-reason" value={values.reason} maxLength={MAX_REASON_LENGTH} disabled={isSubmitting} aria-invalid={Boolean(error)} aria-describedby="candidate-rejection-error candidate-rejection-count" onChange={(event) => { setValues({ reason: event.target.value }); setError('') }} /><p id="candidate-rejection-error" className="candidate-dialog__error" aria-live="polite">{error && `Error: ${error}`}</p><p id="candidate-rejection-count" className="candidate-dialog__count">{values.reason.length}/{MAX_REASON_LENGTH}</p></div></div>
      <div className="candidate-dialog__actions"><Button variant="secondary" disabled={isSubmitting} onClick={onCancel}>Cancel</Button><Button variant="danger" type="submit" disabled={isSubmitting} isLoading={isSubmitting} loadingLabel="Rejecting">Reject</Button></div>
    </form>
  </dialog>
}
