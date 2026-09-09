import { useQuery } from '@tanstack/react-query'
import { notificationKeys } from '@core/query/queryKeys'
import { notificationService } from '../services/NotificationService'

export function useNotifications(pageNumber = 1, pageSize = 10) {
  return useQuery({ queryKey: notificationKeys.list(pageNumber, pageSize), queryFn: () => notificationService.getNotifications({ pageNumber, pageSize }), meta: { suppressGlobalError: true } })
}
