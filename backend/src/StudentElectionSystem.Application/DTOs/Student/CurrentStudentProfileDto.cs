using StudentElectionSystem.Domain.Enums;

namespace StudentElectionSystem.Application.DTOs.Student;

public class CurrentStudentProfileDto
{
    public Guid StudentId { get; set; }
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int YearOfStudy { get; set; }
    public Gender Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
}
