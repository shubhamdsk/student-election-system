using StudentElectionSystem.Domain.Enums;
using System;

namespace StudentElectionSystem.Application.DTOs.Election;

public class ElectionListItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public ElectionStatus Status { get; set; }
    public DateTime NominationStartAt { get; set; }
    public DateTime NominationEndAt { get; set; }
    public DateTime VotingStartAt { get; set; }
    public DateTime VotingEndAt { get; set; }
    public int? MaxCandidates { get; set; }
    public DateTime CreatedAt { get; set; }
}
