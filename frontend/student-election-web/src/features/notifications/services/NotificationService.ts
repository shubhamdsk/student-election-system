import { apiClient } from '@core/api/api-client'
import type { EmptyResponseData, PagedResult } from '@core/types/api'
import { buildQueryString } from '@core/utils/query-params'
import type { Notification, NotificationQuery, UnreadNotificationCount } from '../types'

const ENDPOINT = '/notifications'
export class NotificationService {
  async getNotifications(query: NotificationQuery): Promise<PagedResult<Notification>> { return (await apiClient.get<PagedResult<Notification>>(`${ENDPOINT}${buildQueryString(query)}`)).data }
  async getUnreadCount(): Promise<UnreadNotificationCount> { return (await apiClient.get<UnreadNotificationCount>(`${ENDPOINT}/unread-count`)).data }
  async markAsRead(id: string): Promise<void> { await apiClient.put<undefined, EmptyResponseData>(`${ENDPOINT}/${encodeURIComponent(id)}/read`, undefined) }
  async markAllAsRead(): Promise<void> { await apiClient.put<undefined, EmptyResponseData>(`${ENDPOINT}/read-all`, undefined) }
}
export const notificationService = new NotificationService()
