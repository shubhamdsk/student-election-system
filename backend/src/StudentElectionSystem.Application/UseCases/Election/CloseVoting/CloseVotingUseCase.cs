using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.UseCases.Election.CloseVoting;

public class CloseVotingUseCase : ICloseVotingUseCase
{
    private readonly IElectionRepository _electionRepository;
    private readonly INotificationService _notificationService;

    public CloseVotingUseCase(IElectionRepository electionRepository, INotificationService notificationService)
    {
        _electionRepository = electionRepository;
        _notificationService = notificationService;
    }

    public async Task ExecuteAsync(Guid electionId, CancellationToken cancellationToken = default)
    {
        var election = await _electionRepository.GetByIdAsync(electionId, cancellationToken);
        if (election == null)
            throw new NotFoundException($"Election with ID '{electionId}' was not found.");

        try
        {
            election.CloseVoting();
            await _notificationService.CreateForApprovedStudentsAsync(NotificationType.VotingClosed, "Voting has ended", $"Voting has closed for {election.Title}. Results will be published after review.", election.Id, NotificationEntityType.Election, cancellationToken);
            await _electionRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
