using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.DTOs.Election;

namespace StudentElectionSystem.Application.UseCases.Election.GetResults;

public interface IGetElectionResultsUseCase
{
    Task<ElectionResultsDto> ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default);
}
