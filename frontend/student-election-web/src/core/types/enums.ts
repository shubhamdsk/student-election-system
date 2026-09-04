export const USER_ROLES = ['Admin', 'Student'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const APPROVAL_STATUSES = ['Pending', 'Approved', 'Rejected'] as const
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number]
export type ElectionStatus =
  | 'Draft'
  | 'Nominations'
  | 'Voting'
  | 'Closed'
  | 'ResultPublished'
  | 'Cancelled'
export type Gender = 'Male' | 'Female' | 'Other' | 'PreferNotToSay'
