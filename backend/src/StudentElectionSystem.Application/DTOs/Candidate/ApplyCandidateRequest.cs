using System.ComponentModel.DataAnnotations;

namespace StudentElectionSystem.Application.DTOs.Candidate;

public class ApplyCandidateRequest
{
    [StringLength(2000)]
    public string? Manifesto { get; set; }
}
