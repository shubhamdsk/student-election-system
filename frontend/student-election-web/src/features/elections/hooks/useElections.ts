import { useQuery } from '@tanstack/react-query'
import type { PagedResult } from '@core/types/api'
import { electionKeys } from '@core/query/queryKeys'
import { electionService } from '../services/ElectionService'
import type { ElectionListItem, ElectionsQuery } from '../types/election.types'

const EMPTY_RESULT: PagedResult<ElectionListItem> = { items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0 }

export function useElections(query: ElectionsQuery) {
  const normalizedQuery = { ...query, search: query.search?.trim() || undefined }
  const result = useQuery({
    queryKey: electionKeys.list(normalizedQuery),
    queryFn: () => electionService.getElections(normalizedQuery),
    placeholderData: (previousData) => previousData,
  })
  return {
    result: result.data ?? EMPTY_RESULT,
    error: result.error,
    isLoading: result.isLoading || result.isFetching,
    refresh: result.refetch,
  }
}
