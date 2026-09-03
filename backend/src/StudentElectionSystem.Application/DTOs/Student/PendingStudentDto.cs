using StudentElectionSystem.Domain.Enums;
using System;

namespace StudentElectionSystem.Application.DTOs.Student;

public class PendingStudentDto
{
    public Guid StudentId { get; set; }
    public Guid UserId { get; set; }
    public string RegistrationNumber { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int YearOfStudy { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public DateTime CreatedAt { get; set; }
}
