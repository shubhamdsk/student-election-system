import type { CandidateStatusBadgeProps } from '../../types/candidate-management.types'
import './CandidateStatusBadge.scss'

export function CandidateStatusBadge({ status }: CandidateStatusBadgeProps) {
  return <span className={`candidate-status candidate-status--${status.toLowerCase()}`}>{status}</span>
}
