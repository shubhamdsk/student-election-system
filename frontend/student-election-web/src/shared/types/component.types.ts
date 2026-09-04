import type { InputHTMLAttributes } from 'react'

export interface NavigationItem {
  label: string
  to: string
}

export interface AppShellProps {
  title: string
  navigationItems: NavigationItem[]
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
