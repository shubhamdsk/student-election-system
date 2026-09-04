using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Domain.Entities;
using StudentElectionSystem.Application.DTOs.Election;

namespace StudentElectionSystem.Application.Interfaces.Persistence;

public interface IVoteRepository
{
    Task AddAsync(Vote vote, CancellationToken cancellationToken = default);
    Task<ElectionResultsDto?> GetElectionResultsAsync(Guid electionId, CancellationToken cancellationToken = default);
}
