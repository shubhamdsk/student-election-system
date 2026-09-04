using StudentElectionSystem.Domain.Enums;
using System;

namespace StudentElectionSystem.Application.DTOs.Election;

public class ElectionDetailsDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ElectionStatus Status { get; set; }
    public DateTime NominationStartAt { get; set; }
    public DateTime NominationEndAt { get; set; }
    public DateTime VotingStartAt { get; set; }
    public DateTime VotingEndAt { get; set; }
    public int? MaxCandidates { get; set; }
    public Guid CreatedByAdminId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
