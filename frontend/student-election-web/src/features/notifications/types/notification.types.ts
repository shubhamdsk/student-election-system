import type { UserRole } from '@core/types/enums'

export type NotificationType = 'StudentApproved' | 'StudentRejected' | 'CandidateApplicationSubmitted' | 'CandidateApproved' | 'CandidateRejected' | 'NominationsOpened' | 'VotingStarted' | 'VotingClosed' | 'ResultsPublished'
export type NotificationEntityType = 'Student' | 'Candidate' | 'Election'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  relatedEntityId: string | null
  relatedEntityType: NotificationEntityType | null
  isRead: boolean
  createdAt: string
  readAt: string | null
}
export interface NotificationQuery { pageNumber?: number; pageSize?: number; isRead?: boolean }
export interface UnreadNotificationCount { count: number }
export interface NotificationBellProps { role: UserRole }
export interface NotificationPanelProps { role: UserRole; onClose(): void }
export interface NotificationItemProps { notification: Notification; role: UserRole; onSelect(notification: Notification): void }
export interface NotificationEmptyStateProps { isError: boolean; onRetry(): void }
