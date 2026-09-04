import { apiClient } from '@core/api/api-client'
import type { EmptyResponseData, PagedResult } from '@core/types/api'
import { buildQueryString } from '@core/utils/query-params'
import type { CreateElectionRequest, ElectionDetails, ElectionListItem, ElectionsQuery, UpdateElectionRequest } from '../types/election.types'

const ELECTIONS_ENDPOINT = '/elections'
const resourcePath = (electionId: string) => `${ELECTIONS_ENDPOINT}/${encodeURIComponent(electionId)}`

export class ElectionService {
  async create(request: CreateElectionRequest): Promise<ElectionDetails> {
    return (await apiClient.post<CreateElectionRequest, ElectionDetails>(ELECTIONS_ENDPOINT, request)).data
  }
  async getList(query: ElectionsQuery = {}): Promise<PagedResult<ElectionListItem>> {
    return (await apiClient.get<PagedResult<ElectionListItem>>(`${ELECTIONS_ENDPOINT}${buildQueryString(query)}`)).data
  }
  async getById(electionId: string): Promise<ElectionDetails> {
    return (await apiClient.get<ElectionDetails>(resourcePath(electionId))).data
  }
  async update(electionId: string, request: UpdateElectionRequest): Promise<void> {
    await apiClient.put<UpdateElectionRequest, EmptyResponseData>(resourcePath(electionId), request)
  }
  async cancel(electionId: string): Promise<void> { await this.transition(electionId, 'cancel') }
  async openNominations(electionId: string): Promise<void> { await this.transition(electionId, 'open-nominations') }
  async startVoting(electionId: string): Promise<void> { await this.transition(electionId, 'start-voting') }
  async closeVoting(electionId: string): Promise<void> { await this.transition(electionId, 'close-voting') }
  async publishResults(electionId: string): Promise<void> { await this.transition(electionId, 'publish-results') }

  private async transition(electionId: string, action: string): Promise<void> {
    await apiClient.put<undefined, EmptyResponseData>(`${resourcePath(electionId)}/${action}`, undefined)
  }
}

export const electionService = new ElectionService()
