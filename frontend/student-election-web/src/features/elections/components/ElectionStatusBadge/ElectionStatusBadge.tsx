import type { ElectionStatusBadgeProps } from '../../types/election-management.types'
import './ElectionStatusBadge.scss'

export function ElectionStatusBadge({ status }: ElectionStatusBadgeProps) {
  return <span className={`election-status election-status--${status.toLowerCase()}`}>{status === 'ResultPublished' ? 'Result Published' : status}</span>
}
