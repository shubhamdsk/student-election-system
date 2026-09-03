using StudentElectionSystem.Domain.Enums;
using System;

namespace StudentElectionSystem.Application.DTOs.Student;

public class StudentDetailsDto
{
    public Guid StudentId { get; set; }
    public Guid UserId { get; set; }
    public string RegistrationNumber { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int YearOfStudy { get; set; }
    public Gender Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime? RejectedAt { get; set; }
    public string? RejectionReason { get; set; }
}
