using System;

namespace StudentElectionSystem.Application.DTOs.Candidate;

public class MyCandidateApplicationDto
{
    public Guid CandidateId { get; set; }
    public Guid ElectionId { get; set; }
    public string ElectionTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Pending, Approved, Rejected
    public string? Manifesto { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime? RejectedAt { get; set; }
    public string? RejectionReason { get; set; }
}
