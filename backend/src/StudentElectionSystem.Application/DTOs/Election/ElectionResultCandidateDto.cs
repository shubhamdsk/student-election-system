using System;

namespace StudentElectionSystem.Application.DTOs.Election;

public record ElectionResultCandidateDto(
    Guid CandidateId,
    string FullName,
    string Department,
    int YearOfStudy,
    string Manifesto,
    int VoteCount,
    int Rank,
    bool IsWinner
);
