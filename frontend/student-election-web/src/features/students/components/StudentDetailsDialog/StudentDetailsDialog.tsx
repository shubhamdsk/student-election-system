import { useEffect, useRef } from 'react'
import { formatUtcDateTime } from '@core/utils/date'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import type { StudentDetailsDialogProps } from '../../types/admin-student.types'
import { displayOptional, formatGender } from '../../utils/student-display'
import '../StudentDialog/StudentDialog.scss'
import './StudentDetailsDialog.scss'

export function StudentDetailsDialog({ student, isLoading, onClose }: StudentDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isOpen = isLoading || Boolean(student)
  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && dialog && !dialog.open) dialog.showModal()
    if (!isOpen && dialog?.open) dialog.close()
  }, [isOpen])

  return <dialog ref={dialogRef} className="student-dialog" aria-labelledby="student-details-title" onCancel={onClose} onClose={onClose}>
    <header className="student-dialog__header"><h2 id="student-details-title">Student details</h2><Button className="student-dialog__close" variant="ghost" aria-label="Close student details" onClick={onClose}>Close</Button></header>
    <div className="student-dialog__content">
      {isLoading && !student ? <LoadingSpinner label="Loading student details" /> : student && <dl className="student-details">
        <div><dt>Full Name</dt><dd>{student.fullName}</dd></div><div><dt>Registration Number</dt><dd>{student.registrationNumber}</dd></div>
        <div><dt>Email</dt><dd>{student.email}</dd></div><div><dt>Department</dt><dd>{student.department}</dd></div>
        <div><dt>Year of Study</dt><dd>{student.yearOfStudy}</dd></div><div><dt>Gender</dt><dd>{formatGender(student.gender)}</dd></div>
        <div><dt>Phone Number</dt><dd>{displayOptional(student.phoneNumber)}</dd></div><div><dt>Approval Status</dt><dd>{student.approvalStatus}</dd></div>
        <div><dt>Registered At</dt><dd>{formatUtcDateTime(student.createdAt)}</dd></div>
        {student.approvedAt && <div><dt>Approved At</dt><dd>{formatUtcDateTime(student.approvedAt)}</dd></div>}
        {student.rejectedAt && <div><dt>Rejected At</dt><dd>{formatUtcDateTime(student.rejectedAt)}</dd></div>}
        {student.rejectionReason && <div className="student-details__wide"><dt>Rejection Reason</dt><dd>{student.rejectionReason}</dd></div>}
      </dl>}
    </div>
  </dialog>
}
