import type { ApprovalStatus } from '@core/types/enums'
import type { SnackbarType } from '@shared/types/snackbar.types'

export interface StudentApprovalNotice {
  type: Extract<SnackbarType, 'info' | 'warning'>
  message: string
}

export interface ApprovalCheckState {
  status: 'checking' | 'approved' | 'denied' | 'error'
  approvalStatus?: ApprovalStatus
}
