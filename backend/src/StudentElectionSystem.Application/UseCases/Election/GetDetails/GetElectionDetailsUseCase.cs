using StudentElectionSystem.Application.DTOs.Election;
using StudentElectionSystem.Application.Interfaces.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Election.GetDetails;

public class GetElectionDetailsUseCase : IGetElectionDetailsUseCase
{
    private readonly IElectionRepository _electionRepository;

    public GetElectionDetailsUseCase(IElectionRepository electionRepository)
    {
        _electionRepository = electionRepository;
    }

    public async Task<ElectionDetailsDto?> ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _electionRepository.GetDetailsByIdAsync(id, cancellationToken);
    }
}
