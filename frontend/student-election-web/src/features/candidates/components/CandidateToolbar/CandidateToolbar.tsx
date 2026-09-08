import { SelectDropdown } from '@shared/components/SelectDropdown/SelectDropdown'
import type { CandidateToolbarProps } from '../../types/candidate-management.types'
import './CandidateToolbar.scss'

export function CandidateToolbar({ search, electionId, elections, isLoadingElections, onSearchChange, onElectionChange }: CandidateToolbarProps) {
  return <div className="candidate-toolbar">
    <div className="candidate-toolbar__search">
      <label htmlFor="candidate-search">Search candidates</label>
      <input
        id="candidate-search"
        type="search"
        value={search}
        placeholder="Search by student, registration number, email, or election"
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
    <div className="candidate-toolbar__filter">
      <SelectDropdown label="Election" value={electionId} disabled={isLoadingElections} options={[{ value: '', label: 'All Elections' }, ...(Array.isArray(elections) ? elections : []).map((election) => ({ value: election.id, label: election.title }))]} onChange={onElectionChange} />
    </div>
  </div>
}
