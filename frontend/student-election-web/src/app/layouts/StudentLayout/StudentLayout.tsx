import { AppShell } from '@shared/components/AppShell/AppShell'

const navigationItems = [
  { label: 'Dashboard', to: '/student' },
  { label: 'Elections', to: '/student/elections' },
  { label: 'My Applications', to: '/student/candidates' },
  { label: 'Profile', to: '/student/profile' },
]

export function StudentLayout() { return <AppShell title="Student portal" navigationItems={navigationItems} /> }
