using StudentElectionSystem.Application.DTOs.Student;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.UseCases.Student;

public class RejectStudentUseCase : IRejectStudentUseCase
{
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly INotificationService _notificationService;

    public RejectStudentUseCase(IStudentRepository studentRepository, ICurrentUserService currentUserService, INotificationService notificationService)
    {
        _studentRepository = studentRepository;
        _currentUserService = currentUserService;
        _notificationService = notificationService;
    }

    public async Task ExecuteAsync(Guid studentId, RejectStudentRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Reason))
        {
            throw new ArgumentException("A rejection reason must be provided.", nameof(request.Reason));
        }

        var adminId = _currentUserService.UserId ?? throw new UnauthorizedAccessException("Current user is not authenticated.");
        
        var student = await _studentRepository.GetByIdAsync(studentId, cancellationToken);
        if (student == null)
        {
            throw new NotFoundException(nameof(student), studentId);
        }

        try
        {
            student.Reject(adminId, request.Reason);
            await _notificationService.CreateForUserAsync(student.UserId, NotificationType.StudentRejected, "Registration rejected", "Your student registration has been rejected.", student.Id, NotificationEntityType.Student, cancellationToken);
            await _studentRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
