import type { ApprovalStatus, ElectionStatus } from '@core/types/enums'

export interface ApplyCandidateRequest { manifesto?: string | null }
export interface RejectCandidateRequest { reason: string }

export interface CandidateApplication {
  candidateId: string
  electionId: string
  electionTitle: string
  status: ApprovalStatus
  manifesto: string | null
  createdAt: string
  approvedAt: string | null
  rejectedAt: string | null
  rejectionReason: string | null
}

export interface PendingCandidate {
  candidateId: string
  electionId: string
  electionTitle: string
  studentId: string
  studentFullName: string
  studentRegistrationNumber: string
  studentEmail: string
  nominatedAt: string
}

export interface CandidateDetails extends PendingCandidate {
  electionStatus: ElectionStatus
  status: ApprovalStatus
  manifesto: string | null
  approvedAt: string | null
  approvedByAdminId: string | null
  rejectedAt: string | null
  rejectionReason: string | null
}

export interface PendingCandidatesQuery { pageNumber?: number; pageSize?: number }
