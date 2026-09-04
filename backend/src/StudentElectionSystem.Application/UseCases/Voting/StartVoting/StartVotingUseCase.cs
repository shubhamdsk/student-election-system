using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;

namespace StudentElectionSystem.Application.UseCases.Voting.StartVoting;

public class StartVotingUseCase : IStartVotingUseCase
{
    private readonly IElectionRepository _electionRepository;

    public StartVotingUseCase(IElectionRepository electionRepository)
    {
        _electionRepository = electionRepository;
    }

    public async Task ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        var election = await _electionRepository.GetByIdAsync(electionId, cancellationToken);
        
        if (election == null)
            throw new NotFoundException("Election not found.");

        try
        {
            election.OpenVoting();
            await _electionRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
