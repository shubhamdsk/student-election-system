import { useState } from 'react'
import { ApproveStudentDialog } from '../../components/ApproveStudentDialog/ApproveStudentDialog'
import { PendingStudentsTable } from '../../components/PendingStudentsTable/PendingStudentsTable'
import { RejectStudentDialog } from '../../components/RejectStudentDialog/RejectStudentDialog'
import { StudentDetailsDialog } from '../../components/StudentDetailsDialog/StudentDetailsDialog'
import { StudentPagination } from '../../components/StudentPagination/StudentPagination'
import { StudentSearch } from '../../components/StudentSearch/StudentSearch'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { usePendingStudents } from '../../hooks/usePendingStudents'
import { useStudentApprovalActions } from '../../hooks/useStudentApprovalActions'
import { useStudentDetails } from '../../hooks/useStudentDetails'
import type { PendingStudent } from '../../types/student.types'
import './AdminStudentsPage.scss'

const DEFAULT_PAGE_SIZE = 10
const SEARCH_DELAY_MS = 400

export function AdminStudentsPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [approvalStudent, setApprovalStudent] = useState<PendingStudent>()
  const [rejectionStudent, setRejectionStudent] = useState<PendingStudent>()
  const debouncedSearch = useDebouncedValue(search, SEARCH_DELAY_MS)
  const { result, isLoading, refresh } = usePendingStudents(pageNumber, pageSize, debouncedSearch)
  const details = useStudentDetails()
  const actions = useStudentApprovalActions(() => {
    details.close()
    if (result.items.length === 1 && pageNumber > 1) {
      setPageNumber((current) => current - 1)
    } else {
      void refresh()
    }
  })

  const updateSearch = (value: string) => {
    setSearch(value)
    setPageNumber(1)
  }

  const updatePageSize = (value: number) => {
    setPageSize(value)
    setPageNumber(1)
  }

  const confirmApproval = async () => {
    if (approvalStudent && await actions.approve(approvalStudent.studentId)) {
      setApprovalStudent(undefined)
    }
  }

  const confirmRejection = async (reason: string) => {
    if (rejectionStudent && await actions.reject(rejectionStudent.studentId, reason)) {
      setRejectionStudent(undefined)
    }
  }

  return (
    <section className="admin-students-page" aria-label="Pending student registrations">
      <div className="admin-students-page__toolbar">
        <StudentSearch value={search} onChange={updateSearch} />
      </div>
      <div className="admin-students-page__content">
        <PendingStudentsTable
          students={result.items}
          isLoading={isLoading}
          hasSearch={Boolean(debouncedSearch.trim())}
          actionStudentId={actions.actionStudentId}
          onView={(student) => { void details.open(student.studentId) }}
          onApprove={setApprovalStudent}
          onReject={setRejectionStudent}
        />
      </div>
      <StudentPagination
        pageNumber={result.pageNumber || pageNumber}
        pageSize={pageSize}
        totalCount={result.totalCount}
        totalPages={result.totalPages}
        isDisabled={isLoading}
        onPageChange={setPageNumber}
        onPageSizeChange={updatePageSize}
      />
      <StudentDetailsDialog student={details.student} isLoading={details.isLoading} onClose={details.close} />
      <ApproveStudentDialog
        student={approvalStudent}
        isSubmitting={actions.actionStudentId === approvalStudent?.studentId}
        onCancel={() => setApprovalStudent(undefined)}
        onConfirm={() => { void confirmApproval() }}
      />
      <RejectStudentDialog
        student={rejectionStudent}
        isSubmitting={actions.actionStudentId === rejectionStudent?.studentId}
        onCancel={() => setRejectionStudent(undefined)}
        onConfirm={(reason) => { void confirmRejection(reason) }}
      />
    </section>
  )
}
