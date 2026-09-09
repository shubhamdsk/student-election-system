import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationKeys } from '@core/query/queryKeys'
import { useSnackbar } from '@shared/hooks/useSnackbar'
import { notificationService } from '../services/NotificationService'
export function useMarkNotificationRead() {
  const queryClient = useQueryClient(); const { showError } = useSnackbar()
  return useMutation({ mutationFn: (id: string) => notificationService.markAsRead(id), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: notificationKeys.all }) }, onError: () => showError('Unable to mark the notification as read.') })
}
