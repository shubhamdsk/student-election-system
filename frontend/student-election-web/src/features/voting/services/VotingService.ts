import { apiClient } from '@core/api/api-client'
import type { EmptyResponseData } from '@core/types/api'
import type { CastVoteRequest, VotingCandidate } from '../types/voting.types'

const votingPath = (electionId: string) => `/elections/${encodeURIComponent(electionId)}/votes`

export class VotingService {
  async getCandidates(electionId: string): Promise<VotingCandidate[]> {
    return (await apiClient.get<VotingCandidate[]>(`${votingPath(electionId)}/candidates`)).data
  }
  async castVote(electionId: string, request: CastVoteRequest): Promise<void> {
    await apiClient.post<CastVoteRequest, EmptyResponseData>(votingPath(electionId), request)
  }
}

export const votingService = new VotingService()
