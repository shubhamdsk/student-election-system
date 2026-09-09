using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.UseCases.Voting.StartVoting;

public class StartVotingUseCase : IStartVotingUseCase
{
    private readonly IElectionRepository _electionRepository;
    private readonly ICandidateRepository _candidateRepository;
    private readonly INotificationService _notificationService;

    public StartVotingUseCase(IElectionRepository electionRepository, ICandidateRepository candidateRepository, INotificationService notificationService)
    {
        _electionRepository = electionRepository;
        _candidateRepository = candidateRepository;
        _notificationService = notificationService;
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
            await _notificationService.CreateForApprovedStudentsAsync(NotificationType.VotingStarted, "Voting has started", $"Voting is now open for {election.Title}.", election.Id, NotificationEntityType.Election, cancellationToken);
            await _electionRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
