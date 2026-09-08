import type { ElectionStatus } from '@core/types/enums'

export type AdminAttentionTone = 'danger' | 'warning' | 'primary' | 'muted'

export interface AdminAttentionItem {
  id: string
  priority: number
  title: string
  message: string
  actionLabel: string
  path: string
  tone: AdminAttentionTone
}

export interface AdminElectionView {
  id: string
  title: string
  status: ElectionStatus
  activityLabel: string
  activityAt: string
  message: string
}
