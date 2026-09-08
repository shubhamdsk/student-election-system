export interface SelectDropdownOption {
  value: string
  label: string
}

export interface SelectDropdownProps {
  label: string
  value: string
  options: SelectDropdownOption[]
  disabled?: boolean
  required?: boolean
  error?: string
  reserveErrorSpace?: boolean
  className?: string
  onChange(value: string): void
}
