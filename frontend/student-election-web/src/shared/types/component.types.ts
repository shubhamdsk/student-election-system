import type { ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
export type ButtonSize = 'small' | 'medium'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  loadingLabel?: string
}

export interface NavigationItem {
  label: string
  to: string
}

export interface AppShellProps {
  title: string
  navigationItems: NavigationItem[]
  isWideContent?: boolean
}

export interface FormErrorProps {
  message?: string
}

export interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string
  label: string
  error?: string
}

export interface LoadingSpinnerProps {
  label?: string
}

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  id: string
  label: string
  error?: string
}

export interface PlaceholderPageProps {
  title: string
}
