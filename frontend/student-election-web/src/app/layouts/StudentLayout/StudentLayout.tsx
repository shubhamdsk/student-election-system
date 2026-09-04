import { AppShell } from '@shared/components/AppShell/AppShell'

const navigationItems = [
  { label: 'Home', to: '/student' }, { label: 'Elections', to: '/student/elections' },
  { label: 'Candidates', to: '/student/candidates' }, { label: 'Voting', to: '/student/voting' },
  { label: 'Results', to: '/student/results' },
]

export function StudentLayout() { return <AppShell title="Student portal" navigationItems={navigationItems} /> }
