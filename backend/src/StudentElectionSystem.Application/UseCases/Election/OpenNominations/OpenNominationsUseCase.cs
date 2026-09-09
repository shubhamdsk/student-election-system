using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Application.Interfaces.Services;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.UseCases.Election.OpenNominations;

public class OpenNominationsUseCase : IOpenNominationsUseCase
{
    private readonly IElectionRepository _electionRepository;
    private readonly INotificationService _notificationService;

    public OpenNominationsUseCase(IElectionRepository electionRepository, INotificationService notificationService)
    {
        _electionRepository = electionRepository;
        _notificationService = notificationService;
    }

    public async Task ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var election = await _electionRepository.GetByIdAsync(id, cancellationToken);
        if (election == null)
            throw new NotFoundException(nameof(Domain.Entities.Election), id);

        try
        {
            election.OpenNominations();
            await _notificationService.CreateForApprovedStudentsAsync(NotificationType.NominationsOpened, "Nominations are open", $"Candidate applications are now open for {election.Title}.", election.Id, NotificationEntityType.Election, cancellationToken);
            await _electionRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
