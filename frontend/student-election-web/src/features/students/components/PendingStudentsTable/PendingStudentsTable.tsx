import { useMemo } from 'react'
import { createColumnHelper, tableFeatures, useTable } from '@tanstack/react-table'
import { formatUtcDateTime } from '@core/utils/date'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import type { PendingStudentsTableProps } from '../../types/admin-student.types'
import type { PendingStudent } from '../../types/student.types'
import './PendingStudentsTable.scss'

const features = tableFeatures({})
const columnHelper = createColumnHelper<typeof features, PendingStudent>()

export function PendingStudentsTable({
  students, isLoading, hasSearch, actionStudentId, onView, onApprove, onReject,
}: PendingStudentsTableProps) {
  const columns = useMemo(() => columnHelper.columns([
    columnHelper.accessor('registrationNumber', { header: 'Registration Number' }),
    columnHelper.accessor('fullName', { header: 'Full Name' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('department', { header: 'Department' }),
    columnHelper.accessor('yearOfStudy', { header: 'Year' }),
    columnHelper.accessor('approvalStatus', {
      header: 'Status',
      cell: (context) => <span className="pending-students-table__status">{context.getValue()}</span>,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Registered At',
      cell: (context) => formatUtcDateTime(context.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const student = row.original
        const isBusy = actionStudentId === student.studentId
        return (
          <div className="pending-students-table__actions">
            <Button variant="ghost" size="small" onClick={() => onView(student)}>View</Button>
            <Button variant="success" size="small" disabled={Boolean(actionStudentId)} isLoading={isBusy} loadingLabel="Working" onClick={() => onApprove(student)}>Approve</Button>
            <Button variant="danger" size="small" disabled={Boolean(actionStudentId)} onClick={() => onReject(student)}>Reject</Button>
          </div>
        )
      },
    }),
  ]), [actionStudentId, onApprove, onReject, onView])
  const table = useTable({ features, columns, data: students })

  if (isLoading) return <div className="pending-students-table__state"><LoadingSpinner label="Loading pending students" /></div>
  if (students.length === 0) return <p className="pending-students-table__state">{hasSearch ? 'No students match your search.' : 'No pending student registrations found.'}</p>

  return (
    <div className="pending-students-table__container">
      <table className="pending-students-table__table">
        <caption className="pending-students-table__caption">Pending student registrations</caption>
        <thead>{table.getHeaderGroups().map((headerGroup) => <tr key={headerGroup.id}>{headerGroup.headers.map((header) => <th key={header.id} scope="col"><table.FlexRender header={header} /></th>)}</tr>)}</thead>
        <tbody>{table.getRowModel().rows.map((row) => <tr key={row.id}>{row.getAllCells().map((cell) => <td key={cell.id}><table.FlexRender cell={cell} /></td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}
