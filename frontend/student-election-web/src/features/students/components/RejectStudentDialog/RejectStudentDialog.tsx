import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '@shared/components/Button/Button'
import type { RejectStudentDialogProps, RejectStudentFormValues } from '../../types/admin-student.types'
import '../StudentDialog/StudentDialog.scss'

const INITIAL_VALUES: RejectStudentFormValues = { reason: '' }

export function RejectStudentDialog({ student, isSubmitting, onCancel, onConfirm }: RejectStudentDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [error, setError] = useState('')
  useEffect(() => {
    const dialog = dialogRef.current
    if (student && dialog && !dialog.open) { setValues(INITIAL_VALUES); setError(''); dialog.showModal() }
    if (!student && dialog?.open) dialog.close()
  }, [student])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const reason = values.reason.trim()
    if (!reason) { setError('Reason is required.'); return }
    if (reason.length > 500) { setError('Reason must be 500 characters or fewer.'); return }
    onConfirm(reason)
  }

  return <dialog ref={dialogRef} className="student-dialog" aria-labelledby="reject-student-title" onCancel={(event) => { if (isSubmitting) event.preventDefault(); else onCancel() }}>
    <form onSubmit={submit} noValidate>
      <header className="student-dialog__header"><h2 id="reject-student-title">Reject student?</h2><Button className="student-dialog__close" variant="ghost" aria-label="Close rejection dialog" disabled={isSubmitting} onClick={onCancel}>Close</Button></header>
      <div className="student-dialog__content"><div className="student-dialog__field"><label htmlFor="rejection-reason">Reason for rejecting {student?.fullName ?? 'student'} <span aria-hidden="true">*</span></label><textarea id="rejection-reason" value={values.reason} maxLength={500} disabled={isSubmitting} aria-invalid={Boolean(error)} aria-describedby="rejection-reason-error rejection-reason-count" onChange={(event) => { setValues({ reason: event.target.value }); setError('') }} /><p id="rejection-reason-error" className="student-dialog__error" aria-live="polite">{error && `Error: ${error}`}</p><p id="rejection-reason-count" className="student-dialog__count">{values.reason.length}/500</p></div></div>
      <div className="student-dialog__actions"><Button variant="secondary" disabled={isSubmitting} onClick={onCancel}>Cancel</Button><Button variant="danger" type="submit" disabled={isSubmitting} isLoading={isSubmitting} loadingLabel="Rejecting">Reject</Button></div>
    </form>
  </dialog>
}
