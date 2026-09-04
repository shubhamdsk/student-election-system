using StudentElectionSystem.Application.DTOs.Candidate;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.Apply;

public interface IApplyCandidateUseCase
{
    Task<MyCandidateApplicationDto> ExecuteAsync(Guid electionId, ApplyCandidateRequest request, CancellationToken cancellationToken = default);
}
