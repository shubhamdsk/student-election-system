using StudentElectionSystem.Application.DTOs.Candidate;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Candidate.GetDetails;

public interface IGetCandidateDetailsUseCase
{
    Task<CandidateDetailsDto?> ExecuteAsync(Guid id, CancellationToken cancellationToken = default);
}
