import { SelectDropdown } from '@shared/components/SelectDropdown/SelectDropdown'
import { SearchInput } from '@shared/components/SearchInput/SearchInput'
import type { CandidateToolbarProps } from '../../types/candidate-management.types'
import './CandidateToolbar.scss'

export function CandidateToolbar({ search, electionId, elections, isLoadingElections, onSearchChange, onElectionChange }: CandidateToolbarProps) {
  return <div className="candidate-toolbar">
    <div className="candidate-toolbar__search">
      <SearchInput
        id="candidate-search"
        label="Search candidates"
        value={search}
        onChange={onSearchChange}
        placeholder="Search by student, registration number, email, or election"
        minChars={3}
      />
    </div>
    <div className="candidate-toolbar__filter">
      <SelectDropdown label="Election" value={electionId} disabled={isLoadingElections} options={[{ value: '', label: 'All Elections' }, ...(Array.isArray(elections) ? elections : []).map((election) => ({ value: election.id, label: election.title }))]} onChange={onElectionChange} />
    </div>
  </div>
}
