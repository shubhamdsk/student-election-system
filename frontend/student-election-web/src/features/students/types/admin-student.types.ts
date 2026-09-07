import type { PendingStudent, StudentDetails } from './student.types'

export interface StudentSearchProps {
  value: string
  onChange(value: string): void
}

export interface PendingStudentsTableProps {
  students: PendingStudent[]
  isLoading: boolean
  hasSearch: boolean
  actionStudentId?: string
  onView(student: PendingStudent): void
  onApprove(student: PendingStudent): void
  onReject(student: PendingStudent): void
}

export interface StudentPaginationProps {
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  isDisabled: boolean
  onPageChange(pageNumber: number): void
  onPageSizeChange(pageSize: number): void
}

export interface StudentDetailsDialogProps {
  student?: StudentDetails
  isLoading: boolean
  onClose(): void
}

export interface ApproveStudentDialogProps {
  student?: PendingStudent
  isSubmitting: boolean
  onCancel(): void
  onConfirm(): void
}

export interface RejectStudentDialogProps {
  student?: PendingStudent
  isSubmitting: boolean
  onCancel(): void
  onConfirm(reason: string): void
}

export interface RejectStudentFormValues {
  reason: string
}
