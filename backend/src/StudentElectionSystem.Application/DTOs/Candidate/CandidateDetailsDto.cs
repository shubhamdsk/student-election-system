using System;

namespace StudentElectionSystem.Application.DTOs.Candidate;

public class CandidateDetailsDto
{
    public Guid CandidateId { get; set; }
    public Guid ElectionId { get; set; }
    public string ElectionTitle { get; set; } = string.Empty;
    public string ElectionStatus { get; set; } = string.Empty;
    
    public Guid StudentId { get; set; }
    public string StudentFullName { get; set; } = string.Empty;
    public string StudentRegistrationNumber { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    
    public string Status { get; set; } = string.Empty; // Pending, Approved, Rejected
    public string? Manifesto { get; set; }
    public DateTime NominatedAt { get; set; }
    
    public DateTime? ApprovedAt { get; set; }
    public Guid? ApprovedByAdminId { get; set; }
    
    public DateTime? RejectedAt { get; set; }
    public string? RejectionReason { get; set; }
}
