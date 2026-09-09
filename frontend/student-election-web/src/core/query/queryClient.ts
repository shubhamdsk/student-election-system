// src/core/query/queryClient.ts
import { QueryCache, QueryClient } from '@tanstack/react-query'

export function createQueryClient(onQueryError: (error: unknown) => void) {
  return new QueryClient({
    queryCache: new QueryCache({ onError: onQueryError }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 1, // 1 minute stale time
        gcTime: 1000 * 60 * 10, // 10 minutes garbage collection time
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}
