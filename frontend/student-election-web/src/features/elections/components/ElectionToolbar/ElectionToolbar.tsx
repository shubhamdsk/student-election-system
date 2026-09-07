import type { ElectionStatus } from '@core/types/enums'
import { Button } from '@shared/components/Button/Button'
import type { ElectionToolbarProps } from '../../types/election-management.types'
import './ElectionToolbar.scss'

const STATUSES: readonly { value: ElectionStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' }, { value: 'Draft', label: 'Draft' },
  { value: 'Nominations', label: 'Nominations' }, { value: 'Voting', label: 'Voting' },
  { value: 'Closed', label: 'Closed' }, { value: 'ResultPublished', label: 'Result Published' },
  { value: 'Cancelled', label: 'Cancelled' },
]

export function ElectionToolbar({ search, status, onSearchChange, onStatusChange, onCreate }: ElectionToolbarProps) {
  return <div className="election-toolbar">
    <div className="election-toolbar__search"><label htmlFor="election-search">Search elections</label><input id="election-search" type="search" value={search} placeholder="Search elections" onChange={(event) => onSearchChange(event.target.value)} /></div>
    <div className="election-toolbar__filter"><label htmlFor="election-status">Status</label><select id="election-status" value={status} onChange={(event) => onStatusChange(event.target.value as ElectionStatus | '')}>{STATUSES.map((item) => <option key={item.value || 'all'} value={item.value}>{item.label}</option>)}</select></div>
    <Button onClick={onCreate}>Create Election</Button>
  </div>
}
