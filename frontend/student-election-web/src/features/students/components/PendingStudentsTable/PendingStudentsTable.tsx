// src/features/students/components/PendingStudentsTable/PendingStudentsTable.tsx
import { useMemo } from 'react'
import { formatUtcDateTime } from '@core/utils/date'
import Table from '@components/Table/Table'
import type { Column } from '@shared/types/table.types'
import { Button } from '@shared/components/Button/Button'
import { LoadingSpinner } from '@shared/components/LoadingSpinner/LoadingSpinner'
import type { PendingStudentsTableProps } from '../../types/admin-student.types'
import type { PendingStudent } from '../../types/student.types'
import './PendingStudentsTable.scss'

export function PendingStudentsTable({
  students,
  isLoading,
  hasFilters,
  actionStudentId,
  onView,
  onApprove,
  onReject,
}: PendingStudentsTableProps) {
  const columns = useMemo(
    (): Column<PendingStudent>[] => [
      { key: 'serialNumber', header: 'Sr.No', width: '5rem', align: 'center', render: (_student, index) => index + 1 },
      { key: 'fullName', header: 'Full Name', width: '13rem' },
      { key: 'email', header: 'Email', width: '18rem' },
      { key: 'department', header: 'Department', width: '14rem' },
      { key: 'yearOfStudy', header: 'Year', width: '5rem' },
      {
        key: 'approvalStatus',
        header: 'Status',
        width: '8rem',
        render: (student) => (
          <span className="pending-students-table__status">{student.approvalStatus}</span>
        ),
      },
      { key: 'createdAt', header: 'Registered At', width: '14rem', render: (student) => formatUtcDateTime(student.createdAt) },
      {
        key: 'actions',
        header: 'Actions',
        width: '17rem',
        sticky: 'right',
        render: (student) => {
          const isBusy = actionStudentId === student.studentId
          return (
            <div className="pending-students-table__actions">
              <Button variant="ghost" size="small" onClick={() => onView(student)}>
                View
              </Button>
              <Button
                variant="success"
                size="small"
                disabled={Boolean(actionStudentId)}
                isLoading={isBusy}
                loadingLabel="Working"
                onClick={() => onApprove(student)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="small"
                disabled={Boolean(actionStudentId)}
                onClick={() => onReject(student)}
              >
                Reject
              </Button>
            </div>
          )
        },
      },
    ],
    [actionStudentId, onApprove, onReject, onView]
  )

  return (
    <Table
      columns={columns}
      data={students}
      keyExtractor={(student) => student.studentId}
      loading={isLoading}
      loadingContent={<LoadingSpinner label="Loading pending students" />}
      emptyMessage={hasFilters ? 'No students match the current search and filters.' : 'No pending student registrations found.'}
      caption="Pending student registrations"
      className="pending-students-table__container"
    />
  )
}
