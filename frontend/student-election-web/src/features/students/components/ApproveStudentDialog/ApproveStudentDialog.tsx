import { useEffect, useRef } from 'react'
import { Button } from '@shared/components/Button/Button'
import type { ApproveStudentDialogProps } from '../../types/admin-student.types'
import '../StudentDialog/StudentDialog.scss'

export function ApproveStudentDialog({ student, isSubmitting, onCancel, onConfirm }: ApproveStudentDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (student && dialog && !dialog.open) dialog.showModal()
    if (!student && dialog?.open) dialog.close()
  }, [student])

  return <dialog ref={dialogRef} className="student-dialog" aria-labelledby="approve-student-title" onCancel={(event) => { if (isSubmitting) event.preventDefault(); else onCancel() }}>
    <header className="student-dialog__header"><h2 id="approve-student-title">Approve student?</h2><Button className="student-dialog__close" variant="ghost" aria-label="Close approval confirmation" disabled={isSubmitting} onClick={onCancel}>Close</Button></header>
    <div className="student-dialog__content"><p className="student-dialog__message">Are you sure you want to approve {student?.fullName ?? 'this student'}'s registration?</p></div>
    <div className="student-dialog__actions"><Button variant="secondary" disabled={isSubmitting} onClick={onCancel}>Cancel</Button><Button variant="success" disabled={isSubmitting} isLoading={isSubmitting} loadingLabel="Approving" onClick={onConfirm}>Approve</Button></div>
  </dialog>
}
