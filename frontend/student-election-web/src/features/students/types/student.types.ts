import type { ApprovalStatus, Gender } from '@core/types/enums'

export interface RegisterStudentRequest {
  email: string
  password: string
  registrationNumber: string
  fullName: string
  department: string
  yearOfStudy: number
  gender: Gender
  phoneNumber?: string | null
}

export interface RegisterStudentResponse {
  userId: string
  studentId: string
  email: string
  registrationNumber: string
  fullName: string
  approvalStatus: ApprovalStatus
  message: string
}

export interface PendingStudent {
  studentId: string
  userId: string
  registrationNumber: string
  fullName: string
  email: string
  department: string
  yearOfStudy: number
  approvalStatus: ApprovalStatus
  createdAt: string
}

export interface StudentDetails extends PendingStudent {
  gender: Gender
  phoneNumber: string | null
  approvedAt: string | null
  rejectedAt: string | null
  rejectionReason: string | null
}

export interface RejectStudentRequest { reason: string }
export interface PendingStudentsQuery { pageNumber?: number; pageSize?: number; search?: string }
