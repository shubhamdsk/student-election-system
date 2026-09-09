using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.DTOs.Candidate;
using StudentElectionSystem.Application.DTOs.Voting;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Application.Interfaces.Persistence;

public interface ICandidateRepository
{
    Task AddAsync(Candidate candidate, CancellationToken cancellationToken = default);
    Task UpdateAsync(Candidate candidate, CancellationToken cancellationToken = default);
    Task<Candidate?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    
    Task<bool> HasStudentAppliedToElectionAsync(Guid studentId, Guid electionId, CancellationToken cancellationToken = default);
    Task<int> CountCandidatesByElectionIdAsync(Guid electionId, CancellationToken cancellationToken = default);
    Task<int> CountApprovedCandidatesByElectionIdAsync(Guid electionId, CancellationToken cancellationToken = default);
    
    Task<IEnumerable<MyCandidateApplicationDto>> GetApplicationsByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
    
    // Admin specific
    Task<(IEnumerable<PendingCandidateDto> Items, int TotalCount)> GetPendingCandidatesAsync(
        int page,
        int pageSize,
        string? search,
        Guid? electionId,
        CancellationToken cancellationToken = default);
    Task<Candidate?> GetCandidateWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<VotingCandidateDto>> GetApprovedCandidatesByElectionIdAsync(Guid electionId, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
