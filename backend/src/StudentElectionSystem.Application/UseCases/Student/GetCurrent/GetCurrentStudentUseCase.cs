using StudentElectionSystem.Application.DTOs.Student;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Application.Interfaces.Services;

namespace StudentElectionSystem.Application.UseCases.Student.GetCurrent;

public class GetCurrentStudentUseCase : IGetCurrentStudentUseCase
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IStudentRepository _studentRepository;
    private readonly IUserRepository _userRepository;

    public GetCurrentStudentUseCase(
        ICurrentUserService currentUserService,
        IStudentRepository studentRepository,
        IUserRepository userRepository)
    {
        _currentUserService = currentUserService;
        _studentRepository = studentRepository;
        _userRepository = userRepository;
    }

    public async Task<CurrentStudentProfileDto> ExecuteAsync(CancellationToken cancellationToken = default)
    {
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var student = await _studentRepository.GetByUserIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException("Student profile", userId);
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException("User", userId);

        return new CurrentStudentProfileDto
        {
            StudentId = student.Id,
            UserId = student.UserId,
            RegistrationNumber = student.RegistrationNumber,
            FullName = student.FullName,
            Email = user.Email,
            Department = student.Department,
            YearOfStudy = student.YearOfStudy,
            Gender = student.Gender,
            PhoneNumber = student.PhoneNumber,
            ApprovalStatus = student.ApprovalStatus
        };
    }
}
