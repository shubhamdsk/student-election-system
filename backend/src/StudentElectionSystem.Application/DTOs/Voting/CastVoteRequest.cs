using System;
using System.ComponentModel.DataAnnotations;

namespace StudentElectionSystem.Application.DTOs.Voting;

public class CastVoteRequest
{
    [Required]
    public Guid CandidateId { get; set; }
}
