using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.DTOs.Student;

public class RegisterStudentResponse
{
    public Guid UserId { get; set; }
    public Guid StudentId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public ApprovalStatus ApprovalStatus { get; set; }
    public string Message { get; set; } = string.Empty;
}
