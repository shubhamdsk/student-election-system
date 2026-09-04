export const USER_ROLES = ['Admin', 'Student'] as const
export type UserRole = (typeof USER_ROLES)[number]

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected'
export type ElectionStatus =
  | 'Draft'
  | 'Nominations'
  | 'Voting'
  | 'Closed'
  | 'ResultPublished'
  | 'Cancelled'
export type Gender = 'Male' | 'Female' | 'Other' | 'PreferNotToSay'
