using StudentElectionSystem.Application.DTOs.Student;
using StudentElectionSystem.Application.Exceptions;
using StudentElectionSystem.Application.Interfaces.Authentication;
using StudentElectionSystem.Application.Interfaces.Persistence;
using StudentElectionSystem.Domain.Entities;
using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.UseCases.Student;

public class RegisterStudentUseCase : IRegisterStudentUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IPasswordHasherService _passwordHasherService;

    public RegisterStudentUseCase(
        IUserRepository userRepository,
        IStudentRepository studentRepository,
        IPasswordHasherService passwordHasherService)
    {
        _userRepository = userRepository;
        _studentRepository = studentRepository;
        _passwordHasherService = passwordHasherService;
    }

    public async Task<RegisterStudentResponse> ExecuteAsync(RegisterStudentRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.ToUpperInvariant();

        var emailExists = await _userRepository.ExistsByNormalizedEmailAsync(normalizedEmail, cancellationToken);
        if (emailExists)
        {
            throw new ConflictException("Email is already registered.");
        }

        var passwordHash = _passwordHasherService.HashPassword(request.Password);
        string registrationNumber;
        do
        {
            registrationNumber = $"STU-{DateTime.UtcNow:yyyy}-{Guid.NewGuid():N}"[..30].ToUpperInvariant();
        }
        while (await _studentRepository.ExistsByRegistrationNumberAsync(registrationNumber, cancellationToken));

        var user = new User(request.Email, passwordHash, UserRole.Student);
        await _userRepository.AddAsync(user, cancellationToken);

        var student = new Domain.Entities.Student(
            userId: user.Id,
            fullName: request.FullName,
            registrationNumber: registrationNumber,
            department: request.Department,
            yearOfStudy: request.YearOfStudy,
            gender: request.Gender,
            phoneNumber: request.PhoneNumber
        );

        await _studentRepository.AddAsync(student, cancellationToken);

        await _studentRepository.SaveChangesAsync(cancellationToken);

        return new RegisterStudentResponse
        {
            UserId = user.Id,
            StudentId = student.Id,
            Email = user.Email,
            RegistrationNumber = student.RegistrationNumber,
            FullName = student.FullName,
            ApprovalStatus = student.ApprovalStatus,
            Message = "Student registered successfully. Awaiting administrator approval."
        };
    }
}
