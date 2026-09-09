using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.UseCases.Candidate.Approve;

public class ApproveCandidateUseCase : IApproveCandidateUseCase
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public ApproveCandidateUseCase(ICandidateRepository candidateRepository, ICurrentUserService currentUserService, INotificationService notificationService)
    {
        _candidateRepository = candidateRepository;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var adminId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var candidate = await _candidateRepository.GetCandidateWithDetailsAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Candidate), id);

        try
        {
            candidate.Approve(adminId);
            await _notificationService.CreateForUserAsync(candidate.Student.UserId, NotificationType.CandidateApproved, "Candidate application approved", $"Your candidate application for {candidate.Election.Title} has been approved.", candidate.ElectionId, NotificationEntityType.Election, cancellationToken);
            await _candidateRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
