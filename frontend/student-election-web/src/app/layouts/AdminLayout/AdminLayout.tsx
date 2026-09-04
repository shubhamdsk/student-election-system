import { AppShell } from '@shared/components/AppShell/AppShell'

const navigationItems = [
  { label: 'Home', to: '/admin' }, { label: 'Students', to: '/admin/students' },
  { label: 'Elections', to: '/admin/elections' }, { label: 'Candidates', to: '/admin/candidates' },
  { label: 'Results', to: '/admin/results' },
]

export function AdminLayout() { return <AppShell title="Administration" navigationItems={navigationItems} /> }
