using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StudentElectionSystem.Application.UseCases.Student;

public class ApproveStudentUseCase : IApproveStudentUseCase
{
    private readonly IStudentRepository _studentRepository;
    private readonly ICurrentUserService _currentUserService;

    public ApproveStudentUseCase(IStudentRepository studentRepository, ICurrentUserService currentUserService)
    {
        _studentRepository = studentRepository;
        _currentUserService = currentUserService;
    }

    public async Task ExecuteAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        var adminId = _currentUserService.UserId ?? throw new UnauthorizedAccessException("Current user is not authenticated.");
        
        var student = await _studentRepository.GetByIdAsync(studentId, cancellationToken);
        if (student == null)
        {
            throw new NotFoundException(nameof(student), studentId);
        }

        try
        {
            student.Approve(adminId);
            await _studentRepository.SaveChangesAsync(cancellationToken);
        }
        catch (InvalidOperationException ex)
        {
            throw new ConflictException(ex.Message);
        }
    }
}
