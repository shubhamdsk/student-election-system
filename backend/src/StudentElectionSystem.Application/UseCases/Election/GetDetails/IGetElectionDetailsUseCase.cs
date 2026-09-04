using StudentElectionSystem.Application.DTOs.Election;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.GetDetails;

public interface IGetElectionDetailsUseCase
{
    Task<ElectionDetailsDto?> ExecuteAsync(Guid id, CancellationToken cancellationToken = default);
}
