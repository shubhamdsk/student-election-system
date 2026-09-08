import { apiClient } from '@core/api/api-client'
import type { ElectionResults } from '../types/result.types'

export class ResultService {
  async getElectionResults(electionId: string): Promise<ElectionResults> {
    const id = encodeURIComponent(electionId)
    return (await apiClient.get<ElectionResults>(`/elections/${id}/results`)).data
  }
}

export const resultService = new ResultService()
