import { apiClient } from '@core/api/api-client'
import type { EmptyResponseData, PagedResult } from '@core/types/api'
import { buildQueryString } from '@core/utils/query-params'
import type {
  ApplyCandidateRequest, CandidateApplication, CandidateDetails,
  PendingCandidate, PendingCandidatesQuery, RejectCandidateRequest,
} from '../types/candidate.types'

const CANDIDATES_ENDPOINT = '/candidates'
const resourcePath = (candidateId: string) => `${CANDIDATES_ENDPOINT}/${encodeURIComponent(candidateId)}`

export class CandidateService {
  async apply(electionId: string, request: ApplyCandidateRequest): Promise<CandidateApplication> {
    const id = encodeURIComponent(electionId)
    return (await apiClient.post<ApplyCandidateRequest, CandidateApplication>(`${CANDIDATES_ENDPOINT}/elections/${id}/apply`, request)).data
  }
  async getMyApplications(): Promise<CandidateApplication[]> {
    return (await apiClient.get<CandidateApplication[]>(`${CANDIDATES_ENDPOINT}/me`)).data
  }
  async getPending(query: PendingCandidatesQuery = {}): Promise<PagedResult<PendingCandidate>> {
    return (await apiClient.get<PagedResult<PendingCandidate>>(`${CANDIDATES_ENDPOINT}/pending${buildQueryString(query)}`)).data
  }
  getPendingCandidates(query: PendingCandidatesQuery = {}): Promise<PagedResult<PendingCandidate>> {
    return this.getPending(query)
  }
  async getById(candidateId: string): Promise<CandidateDetails> {
    return (await apiClient.get<CandidateDetails>(resourcePath(candidateId))).data
  }
  getCandidateById(candidateId: string): Promise<CandidateDetails> {
    return this.getById(candidateId)
  }
  async approve(candidateId: string): Promise<void> {
    await apiClient.put<undefined, EmptyResponseData>(`${resourcePath(candidateId)}/approve`, undefined)
  }
  approveCandidate(candidateId: string): Promise<void> {
    return this.approve(candidateId)
  }
  async reject(candidateId: string, request: RejectCandidateRequest): Promise<void> {
    await apiClient.put<RejectCandidateRequest, EmptyResponseData>(`${resourcePath(candidateId)}/reject`, request)
  }
  rejectCandidate(candidateId: string, request: RejectCandidateRequest): Promise<void> {
    return this.reject(candidateId, request)
  }
}

export const candidateService = new CandidateService()
