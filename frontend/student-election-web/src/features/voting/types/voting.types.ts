export interface VotingCandidate {
  candidateId: string
  studentId: string
  fullName: string
  department: string
  yearOfStudy: number
  manifesto: string
}

export interface CastVoteRequest { candidateId: string }
