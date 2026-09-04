using System;

namespace StudentElectionSystem.Application.DTOs.Candidate;

public class PendingCandidateDto
{
    public Guid CandidateId { get; set; }
    public Guid ElectionId { get; set; }
    public string ElectionTitle { get; set; } = string.Empty;
    public Guid StudentId { get; set; }
    public string StudentFullName { get; set; } = string.Empty;
    public string StudentRegistrationNumber { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public DateTime NominatedAt { get; set; }
}
