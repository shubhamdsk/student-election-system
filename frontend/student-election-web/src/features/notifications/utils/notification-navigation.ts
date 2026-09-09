import type { UserRole } from '@core/types/enums'
import type { Notification } from '../types'
export function getNotificationPath(notification: Notification, role: UserRole): string {
  if (role === 'Admin') return notification.type === 'CandidateApplicationSubmitted' ? '/admin/candidates' : '/admin'
  if (notification.type === 'CandidateApproved' || notification.type === 'CandidateRejected') return '/student/candidates'
  if (notification.type === 'VotingStarted' && notification.relatedEntityId) return `/student/elections/${notification.relatedEntityId}/vote`
  if (notification.type === 'ResultsPublished' && notification.relatedEntityId) return `/student/elections/${notification.relatedEntityId}/results`
  if (notification.type === 'NominationsOpened' || notification.type === 'VotingClosed') return '/student/elections'
  return '/student'
}
