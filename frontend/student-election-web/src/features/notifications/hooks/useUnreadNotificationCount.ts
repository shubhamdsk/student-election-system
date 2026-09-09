import { useQuery } from '@tanstack/react-query'
import { notificationKeys } from '@core/query/queryKeys'
import { notificationService } from '../services/NotificationService'
export function useUnreadNotificationCount() { return useQuery({ queryKey: notificationKeys.unreadCount(), queryFn: () => notificationService.getUnreadCount(), meta: { suppressGlobalError: true } }) }
