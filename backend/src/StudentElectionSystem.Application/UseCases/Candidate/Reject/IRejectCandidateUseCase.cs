using StudentElectionSystem.Application.DTOs.Candidate;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.Reject;

public interface IRejectCandidateUseCase
{
    Task ExecuteAsync(Guid id, RejectCandidateRequest request, CancellationToken cancellationToken = default);
}
