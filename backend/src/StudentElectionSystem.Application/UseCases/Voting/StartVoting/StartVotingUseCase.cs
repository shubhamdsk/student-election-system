using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;

namespace StudentElectionSystem.Application.UseCases.Voting.StartVoting;

public class StartVotingUseCase : IStartVotingUseCase
{
    private readonly IElectionRepository _electionRepository;
    private readonly ICandidateRepository _candidateRepository;

    public StartVotingUseCase(IElectionRepository electionRepository, ICandidateRepository candidateRepository)
    {
        _electionRepository = electionRepository;
        _candidateRepository = candidateRepository;
    }

    public async Task ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        var election = await _electionRepository.GetByIdAsync(electionId, cancellationToken);
        
        if (election == null)
            throw new NotFoundException("Election not found.");

        var approvedCandidateCount = await _candidateRepository.CountApprovedCandidatesByElectionIdAsync(electionId, cancellationToken);
        if (approvedCandidateCount < 2)
            throw new ConflictException("Voting cannot start until at least 2 candidates have been approved.");

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
