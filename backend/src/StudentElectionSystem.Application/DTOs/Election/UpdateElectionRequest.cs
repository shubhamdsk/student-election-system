using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StudentElectionSystem.Application.DTOs.Election;

public class UpdateElectionRequest : IValidatableObject
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [Required]
    public DateTime NominationStartAt { get; set; }

    [Required]
    public DateTime NominationEndAt { get; set; }

    [Required]
    public DateTime VotingStartAt { get; set; }

    [Required]
    public DateTime VotingEndAt { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "MaxCandidates must be greater than 0 if provided.")]
    public int? MaxCandidates { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (NominationEndAt <= NominationStartAt)
            yield return new ValidationResult("Nomination end date must be after nomination start date.", new[] { nameof(NominationEndAt) });

        if (VotingStartAt < NominationEndAt)
            yield return new ValidationResult("Voting start date must not be before the nomination end date.", new[] { nameof(VotingStartAt) });

        if (VotingEndAt <= VotingStartAt)
            yield return new ValidationResult("Voting end date must be after voting start date.", new[] { nameof(VotingEndAt) });
    }
}
