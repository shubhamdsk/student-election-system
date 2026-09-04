using System.ComponentModel.DataAnnotations;

namespace StudentElectionSystem.Application.DTOs.Candidate;

public class RejectCandidateRequest
{
    [Required(ErrorMessage = "A rejection reason is required.")]
    [StringLength(1000)]
    public string Reason { get; set; } = string.Empty;
}
