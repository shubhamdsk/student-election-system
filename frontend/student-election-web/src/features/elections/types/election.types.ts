import type { ElectionStatus } from '@core/types/enums'

export interface ElectionRequest {
  title: string
  description?: string | null
  nominationStartAt: string
  nominationEndAt: string
  votingStartAt: string
  votingEndAt: string
  maxCandidates?: number | null
}

export type CreateElectionRequest = ElectionRequest
export type UpdateElectionRequest = ElectionRequest

export interface ElectionListItem {
  id: string
  title: string
  status: ElectionStatus
  nominationStartAt: string
  nominationEndAt: string
  votingStartAt: string
  votingEndAt: string
  maxCandidates: number | null
  createdAt: string
}

export interface ElectionDetails extends ElectionListItem {
  description: string | null
  createdByAdminId: string
  updatedAt: string | null
}

export interface ElectionsQuery {
  pageNumber?: number
  pageSize?: number
  search?: string
  status?: ElectionStatus
}
