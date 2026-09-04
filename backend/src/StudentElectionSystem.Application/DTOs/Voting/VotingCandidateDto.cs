using System;

namespace StudentElectionSystem.Application.DTOs.Voting;

public record VotingCandidateDto(
    Guid CandidateId,
    Guid StudentId,
    string FullName,
    string Department,
    int YearOfStudy,
    string Manifesto
);
