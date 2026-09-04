import type { ElectionStatus } from '@core/types/enums'

export interface ElectionResultCandidate {
  candidateId: string
  fullName: string
  department: string
  yearOfStudy: number
  manifesto: string
  voteCount: number
  rank: number
  isWinner: boolean
}

export interface ElectionResults {
  electionId: string
  electionTitle: string
  status: ElectionStatus
  totalVotes: number
  isTie: boolean
  candidates: ElectionResultCandidate[]
}
