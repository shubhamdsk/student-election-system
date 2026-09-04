using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Domain.Entities;

namespace StudentElectionSystem.Application.Interfaces.Persistence;

public interface IElectionParticipationRepository
{
    Task AddAsync(ElectionParticipation participation, CancellationToken cancellationToken = default);
    Task<bool> HasVotedAsync(Guid studentId, Guid electionId, CancellationToken cancellationToken = default);
}
