using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.Approve;

public interface IApproveCandidateUseCase
{
    Task ExecuteAsync(Guid id, CancellationToken cancellationToken = default);
}
