import type { ReactNode } from 'react'
import type { ApprovalStatus } from '@core/types/enums'

export interface ProfileFieldProps {
  label: string
  value?: string | null
  emptyText?: string
}

export interface ProfileSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export interface ProfileStatusProps {
  status: ApprovalStatus
}
