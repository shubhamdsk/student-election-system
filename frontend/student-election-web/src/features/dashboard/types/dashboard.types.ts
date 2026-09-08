import type { ElectionStatus } from '@core/types/enums'

export type DashboardActionKind = 'election' | 'application' | 'vote' | 'results'
export type DashboardAttentionTone = 'primary' | 'danger' | 'success' | 'info' | 'muted'

export interface DashboardAttentionItem {
  id: string
  priority: number
  title: string
  electionTitle: string
  message: string
  actionLabel: string
  actionKind: DashboardActionKind
  electionId: string
  tone: DashboardAttentionTone
}

export interface DashboardElectionAction {
  label: string
  path: string
}

export interface DashboardElectionView {
  id: string
  title: string
  status: ElectionStatus
  dateLabel: string
  dateValue: string
  action: DashboardElectionAction
}
