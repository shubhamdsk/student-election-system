import type { PendingStudent, StudentDetails } from './student.types'

export interface StudentSearchProps {
  value: string
  department: string
  departments: string[]
  yearOfStudy: number | ''
  onChange(value: string): void
  onDepartmentChange(value: string): void
  onYearOfStudyChange(value: number | ''): void
  onClear(): void
}

export interface PendingStudentsTableProps {
  students: PendingStudent[]
  isLoading: boolean
  hasFilters: boolean
  actionStudentId?: string
  onView(student: PendingStudent): void
  onApprove(student: PendingStudent): void
  onReject(student: PendingStudent): void
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
