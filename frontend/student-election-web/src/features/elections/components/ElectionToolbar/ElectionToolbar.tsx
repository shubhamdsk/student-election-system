import type { ElectionStatus } from '@core/types/enums'
import { Button } from '@shared/components/Button/Button'
import { SelectDropdown } from '@shared/components/SelectDropdown/SelectDropdown'
import { SearchInput } from '@shared/components/SearchInput/SearchInput'
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
    <div className="election-toolbar__search">
      <SearchInput
        id="election-search"
        label="Search elections"
        value={search}
        onChange={onSearchChange}
        placeholder="Search elections…"
        minChars={3}
      />
    </div>
    <div className="election-toolbar__filter"><SelectDropdown label="Status" value={status} options={[...STATUSES]} onChange={(value) => onStatusChange(value as ElectionStatus | '')} /></div>
    <Button onClick={onCreate}>Create Election</Button>
  </div>
}
