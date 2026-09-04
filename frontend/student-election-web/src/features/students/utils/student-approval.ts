import type { ApprovalStatus } from '@core/types/enums'
import type { StudentApprovalNotice } from '../types/approval.types'

export function getStudentApprovalNotice(
  approvalStatus: ApprovalStatus,
): StudentApprovalNotice | null {
  if (approvalStatus === 'Pending') {
    return {
      type: 'info',
      message: 'Your registration is pending administrator approval.',
    }
  }

  if (approvalStatus === 'Rejected') {
    return {
      type: 'warning',
      message: 'Your registration has been rejected. Please contact the administrator.',
    }
  }

  return null
}
