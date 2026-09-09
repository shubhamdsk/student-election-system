using StudentElectionSystem.Application.DTOs.Candidate;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.UseCases.Candidate.Reject;

public class RejectCandidateUseCase : IRejectCandidateUseCase
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public RejectCandidateUseCase(ICandidateRepository candidateRepository, ICurrentUserService currentUserService, INotificationService notificationService)
    {
        _candidateRepository = candidateRepository;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task ExecuteAsync(Guid id, RejectCandidateRequest request, CancellationToken cancellationToken = default)
    {
        var adminId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var candidate = await _candidateRepository.GetCandidateWithDetailsAsync(id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Candidate), id);

        try
        {
            candidate.Reject(adminId, request.Reason);
            await _notificationService.CreateForUserAsync(candidate.Student.UserId, NotificationType.CandidateRejected, "Candidate application rejected", $"Your candidate application for {candidate.Election.Title} has been rejected.", candidate.ElectionId, NotificationEntityType.Election, cancellationToken);
            await _candidateRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
        catch (ArgumentException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
