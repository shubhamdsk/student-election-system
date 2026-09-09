import { AppShell } from '@shared/components/AppShell/AppShell'

const navigationItems = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Students', to: '/admin/students' },
  { label: 'Elections', to: '/admin/elections' },
  { label: 'Candidates', to: '/admin/candidates' },
  { label: 'Profile', to: '/admin/profile' },
]

export function AdminLayout() { return <AppShell title="Administration" navigationItems={navigationItems} isWideContent /> }
