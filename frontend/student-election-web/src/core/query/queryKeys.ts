// src/core/query/queryKeys.ts

export const studentKeys = {
  all: ['students'] as const,
  pendingAll: () => [...studentKeys.all, 'pending'] as const,
  pending: (pageNumber: number, pageSize: number, search?: string) =>
    [...studentKeys.pendingAll(), { pageNumber, pageSize, search: search || '' }] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id?: string) => [...studentKeys.details(), id] as const,
}

export const electionKeys = {
  all: ['elections'] as const,
  lists: () => [...electionKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...electionKeys.lists(), filters] as const,
  details: () => [...electionKeys.all, 'detail'] as const,
  detail: (id?: string) => [...electionKeys.details(), id] as const,
}

export const candidateKeys = {
  all: ['candidates'] as const,
  pendingAll: () => [...candidateKeys.all, 'pending'] as const,
  pending: (pageNumber: number, pageSize: number, search?: string, electionId?: string) =>
    [...candidateKeys.pendingAll(), { pageNumber, pageSize, search: search || '', electionId: electionId || '' }] as const,
  details: () => [...candidateKeys.all, 'detail'] as const,
  byElection: (electionId?: string) => [...candidateKeys.all, 'election', electionId] as const,
  detail: (id?: string) => [...candidateKeys.details(), id] as const,
}

export const votingKeys = {
  all: ['voting'] as const,
  ballot: (electionId?: string) => [...votingKeys.all, 'ballot', electionId] as const,
}

export const resultKeys = {
  all: ['results'] as const,
  election: (electionId?: string) => [...resultKeys.all, 'election', electionId] as const,
}
