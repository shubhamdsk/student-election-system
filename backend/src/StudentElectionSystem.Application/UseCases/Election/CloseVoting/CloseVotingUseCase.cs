using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;

namespace StudentElectionSystem.Application.UseCases.Election.CloseVoting;

public class CloseVotingUseCase : ICloseVotingUseCase
{
    private readonly IElectionRepository _electionRepository;

    public CloseVotingUseCase(IElectionRepository electionRepository)
    {
        _electionRepository = electionRepository;
    }

    public async Task ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        var election = await _electionRepository.GetByIdAsync(electionId, cancellationToken);
        if (election == null)
            throw new NotFoundException($"Election with ID '{electionId}' was not found.");

        try
        {
            election.CloseVoting();
            await _electionRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
