using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Application.Interfaces.Persistence;

public interface ICandidateRepository
{
    Task AddAsync(Candidate candidate, CancellationToken cancellationToken = default);
    Task UpdateAsync(Candidate candidate, CancellationToken cancellationToken = default);
    Task<Candidate?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    
    Task<bool> HasStudentAppliedToElectionAsync(Guid studentId, Guid electionId, CancellationToken cancellationToken = default);
    Task<int> CountCandidatesByElectionIdAsync(Guid electionId, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<Candidate>> GetApplicationsByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
    
    // Admin specific
    Task<(IEnumerable<Candidate> Items, int TotalCount)> GetPendingCandidatesAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    Task<Candidate?> GetCandidateWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
